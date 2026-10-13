# Browser test. Needs: pip install playwright && playwright install chromium
# Run: npm run build && npx vite preview --port 4173   (then in another terminal) python3 tests/e2e.py
import re, json, sys
from playwright.sync_api import sync_playwright, expect

URL = "http://localhost:4173/"
results = []
def check(name, cond, extra=""):
    results.append((name, bool(cond), extra)); print(("PASS " if cond else "FAIL ") + name + (f"  [{extra}]" if extra else ""))

def no_overflow(page, label):
    w = page.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
    check(f"no horizontal overflow: {label}", w[0] <= w[1], str(w))

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width":1280,"height":900})
    page = ctx.new_page()
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type in ("error","warning") else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL); page.wait_for_selector("h1")
    page.screenshot(path="/home/claude/shots/d1_home.png")
    no_overflow(page, "desktop track")

    # --- validation: nothing chosen
    page.get_by_role("button", name="Review entry").click()
    check("validation error shows when no emotion chosen", page.get_by_role("alert").filter(has_text="Choose how").count()==1)

    # --- hierarchy
    page.get_by_role("button", name="Angry", exact=True).click()
    check("secondary options appear after primary", page.get_by_role("button", name="Frustrated").is_visible())
    check("tertiary hidden before secondary chosen", page.get_by_text("Which feels more like you?").count()==0)
    check("error cleared/updated", page.get_by_role("alert").filter(has_text="Choose how").count()==0)
    page.get_by_role("button", name="Review entry").click()
    check("validation asks for secondary", page.get_by_role("alert").filter(has_text="kind of anger").count()==1)
    page.get_by_role("button", name="Frustrated").click()
    check("tertiary options appear", page.get_by_role("button", name="Annoyed").is_visible() and page.get_by_role("button", name="Infuriated").is_visible())
    page.get_by_role("button", name="Annoyed").click()
    check("selected shown via aria-pressed", page.get_by_role("button", name="Annoyed").get_attribute("aria-pressed")=="true")
    # change secondary resets tertiary
    page.get_by_role("button", name="Mad", exact=True).click()
    check("changing secondary resets tertiary", page.get_by_role("button", name="Furious").get_attribute("aria-pressed")=="false" and page.get_by_role("button", name="Annoyed").count()==0)
    page.get_by_role("button", name="Frustrated").click()
    page.get_by_role("button", name="Annoyed").click()
    # change primary resets everything
    page.get_by_role("button", name="Change feeling").click()
    page.get_by_role("button", name="Angry", exact=True).click()
    check("changing primary resets secondary", page.get_by_role("button", name="Frustrated").get_attribute("aria-pressed")=="false")
    page.get_by_role("button", name="Frustrated").click(); page.get_by_role("button", name="Annoyed").click()

    page.get_by_label("Thoughts / Beliefs / Perceptions").fill("I believe my approach is right.")
    page.get_by_label("Wants / Needs / Expectations").fill("I want him to listen.")
    page.get_by_label("Body / Actions / Behaviors").fill("Racing heartbeat.")
    page.screenshot(path="/home/claude/shots/d2_filled.png", full_page=True)

    # navigating away keeps the draft
    page.get_by_role("navigation", name="Main").get_by_role("button", name="Calendar").click()
    check("calendar page opens", page.get_by_role("heading", name="Mood calendar").is_visible())
    page.get_by_role("navigation", name="Main").get_by_role("button", name="Track mood").click()
    check("draft survives navigation", page.get_by_label("Thoughts / Beliefs / Perceptions").input_value()=="I believe my approach is right.")

    page.get_by_role("button", name="Review entry").click()
    check("review shows emotions and answers", page.get_by_role("heading", name="Review your entry").is_visible() and page.get_by_text("Racing heartbeat.").is_visible())
    check("focus moved to review heading", page.evaluate("document.activeElement.id")=="review-heading")
    page.screenshot(path="/home/claude/shots/d3_review.png")
    page.get_by_role("button", name="Back to edit").click()
    check("answers preserved after going back", page.get_by_label("Body / Actions / Behaviors").input_value()=="Racing heartbeat.")
    page.get_by_role("button", name="Review entry").click()
    page.get_by_role("button", name="Save entry").click()
    check("success state", page.get_by_role("heading", name="Entry saved").is_visible())
    page.screenshot(path="/home/claude/shots/d4_saved.png")
    stored = json.loads(page.evaluate("localStorage.getItem('mood.entries.v1')"))
    check("entry persisted to localStorage", len(stored)==1 and stored[0]["emotions"]=={"primary":"Angry","secondary":"Frustrated","tertiary":"Annoyed"} and stored[0]["answers"]["needs"]=="I want him to listen.")
    check("entry has id, timestamp, local date", bool(stored[0]["id"]) and "T" in stored[0]["createdAt"] and re.match(r"\d{4}-\d{2}-\d{2}$", stored[0]["date"]))

    # --- second entry same day
    page.get_by_role("button", name="Add another entry").click()
    check("new form is empty after saving", page.get_by_label("Thoughts / Beliefs / Perceptions").input_value()=="" and page.get_by_text("What are you feeling?").is_visible())
    page.get_by_role("button", name="Happy", exact=True).click()
    page.get_by_role("button", name="Proud").click(); page.get_by_role("button", name="Confident").click()
    page.get_by_role("button", name="Review entry").click()
    check("answers are optional: review shows 'Not answered'", page.get_by_text("Not answered").count()==3)
    page.get_by_role("button", name="Save entry").click()
    stored = json.loads(page.evaluate("localStorage.getItem('mood.entries.v1')"))
    check("second entry same day kept separately", len(stored)==2 and stored[0]["date"]==stored[1]["date"] and stored[0]["id"]!=stored[1]["id"])

    # --- calendar
    page.get_by_role("button", name="View in calendar").click()
    check("calendar opens on saved date with both entries", page.get_by_role("heading", name=re.compile("2 entries")).count()==1 or page.get_by_text("2 entries").first.is_visible())
    cards = page.locator(".entry-card")
    check("two entry cards listed", cards.count()==2)
    sel = page.locator(".day--selected")
    check("selected day has count badge 2", sel.locator(".day__count").inner_text()=="2" and sel.locator(".day__dot").count()==2)
    page.screenshot(path="/home/claude/shots/d5_calendar.png", full_page=True)
    no_overflow(page, "desktop calendar")
    cards.nth(0).click()
    check("entry dialog opens with answers", page.get_by_role("dialog").is_visible() and page.get_by_role("dialog").get_by_text("I believe my approach is right.").is_visible())
    page.screenshot(path="/home/claude/shots/d6_dialog.png")
    page.keyboard.press("Escape")
    check("Escape closes dialog", page.get_by_role("dialog").count()==0)
    check("focus returned to the card", page.evaluate("document.activeElement.classList.contains('entry-card')"))

    # month navigation + empty state
    page.get_by_role("button", name="Previous month").click()
    page.locator(".calendar__grid .day:not(.day--outside)").nth(14).click()
    check("empty date shows friendly empty state", page.locator(".empty-state").is_visible())
    page.get_by_role("button", name="Next month").click(); page.get_by_role("button", name="Next month").click()
    title = page.locator("#calendar-title").inner_text()
    check("month navigation works", title != "" , title)
    page.get_by_role("button", name="Go to today").click()
    check("go to today selects today", page.locator(".day--selected").count()==1 and page.locator(".day--today.day--selected").count()==1)

    # --- reload persistence
    page.reload(); page.wait_for_selector("h1")
    page.get_by_role("navigation", name="Main").get_by_role("button", name="Calendar").click()
    check("entries survive browser refresh", page.locator(".entry-card").count()==2)

    # --- corrupted storage handled
    page.evaluate("localStorage.setItem('mood.entries.v1','{{broken')"); page.reload(); page.wait_for_selector("h1")
    check("corrupt storage does not crash app", page.get_by_role("heading", name="Mood tracking").is_visible())
    # restore data for later checks
    page.evaluate("localStorage.setItem('mood.entries.v1', %s)" % json.dumps(json.dumps(stored))); page.reload()

    # --- keyboard-only selection
    page.wait_for_selector("h1")
    page.get_by_role("button", name="Sad", exact=True).focus()
    page.keyboard.press("Enter")
    page.get_by_role("button", name="Hurt").focus(); page.keyboard.press("Space")
    check("keyboard can select emotions", page.get_by_role("button", name="Hurt").get_attribute("aria-pressed")=="true")
    outline = page.get_by_role("button", name="Hurt").evaluate("e => getComputedStyle(e).outlineStyle")
    check("focus ring visible on focused chip", outline=="solid", outline)

    # --- tablet
    page.set_viewport_size({"width":820,"height":1100}); page.wait_for_timeout(200)
    page.screenshot(path="/home/claude/shots/t1_track.png", full_page=True)
    no_overflow(page, "tablet track")
    page.get_by_role("navigation", name="Main").get_by_role("button", name="Calendar").click()
    page.screenshot(path="/home/claude/shots/t2_calendar.png", full_page=True)
    no_overflow(page, "tablet calendar")
    check("tablet calendar stacked (cards same left edge)", abs(page.locator(".calendar").bounding_box()["x"]-page.locator(".day-entries").bounding_box()["x"])<2)

    # --- mobile step flow
    m = b.new_context(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
    mp = m.new_page(); merr=[]
    mp.on("console", lambda x: merr.append(x.text) if x.type in ("error","warning") else None)
    mp.on("pageerror", lambda e: merr.append(str(e)))
    mp.goto(URL); mp.wait_for_selector("h1")
    mp.screenshot(path="/home/claude/shots/m1_home.png", full_page=True)
    no_overflow(mp, "mobile track")
    check("bottom nav visible on mobile, top nav hidden", mp.locator(".nav--bottom").is_visible() and not mp.locator(".nav--top").is_visible())
    mp.get_by_role("button", name="Angry", exact=True).click()
    mp.get_by_role("button", name="Next").click()
    check("mobile blocks Next without full selection", mp.get_by_role("alert").is_visible() and mp.get_by_text("Reflection 1 of 3", exact=True).count()==0)
    mp.get_by_role("button", name="Frustrated").click(); mp.get_by_role("button", name="Annoyed").click()
    mp.screenshot(path="/home/claude/shots/m2_emotions.png", full_page=True)
    mp.get_by_role("button", name="Next").click()
    check("reflection 1 of 3", mp.get_by_text("Reflection 1 of 3", exact=True).is_visible() and mp.get_by_label("Thoughts / Beliefs / Perceptions").is_visible() and mp.get_by_label("Body / Actions / Behaviors").count()==0)
    mp.get_by_label("Thoughts / Beliefs / Perceptions").fill("mobile thoughts")
    mp.screenshot(path="/home/claude/shots/m3_reflect1.png", full_page=True)
    mp.get_by_role("button", name="Next").click(); mp.get_by_label("Wants / Needs / Expectations").fill("mobile needs")
    mp.get_by_role("button", name="Next").click(); mp.get_by_label("Body / Actions / Behaviors").fill("mobile body")
    check("last step has no Next", mp.get_by_role("button", name="Next").count()==0)
    mp.get_by_role("button", name="‹ Back").click()
    check("Back keeps answers", mp.get_by_label("Wants / Needs / Expectations").input_value()=="mobile needs")
    mp.get_by_role("button", name="Next").click()
    mp.get_by_role("button", name="Review & save").click()
    no_overflow(mp, "mobile review")
    mp.screenshot(path="/home/claude/shots/m4_review.png", full_page=True)
    mp.get_by_role("button", name="Save entry").click()
    check("mobile save success", mp.get_by_role("heading", name="Entry saved").is_visible())
    mp.get_by_role("button", name="View in calendar").click()
    no_overflow(mp, "mobile calendar")
    mp.screenshot(path="/home/claude/shots/m5_calendar.png", full_page=True)
    mp.locator(".entry-card").first.click()
    mp.screenshot(path="/home/claude/shots/m6_dialog.png")
    check("mobile dialog fits viewport", mp.get_by_role("dialog").bounding_box()["width"] <= 390)
    # calendar fits screen
    bb = mp.locator(".calendar__grid").bounding_box(); check("mobile calendar grid fits", bb["x"]>=0 and bb["x"]+bb["width"]<=390, str(bb))
    # tap target sizes
    mp.keyboard.press("Escape")
    mp.get_by_role("navigation", name="Main (mobile)").get_by_role("button", name="Track mood").click()
    small = mp.evaluate("""[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>[b.textContent.trim().slice(0,20), Math.round(b.getBoundingClientRect().height)]).filter(x=>x[1]<44)""")
    check("all visible buttons >= 44px tall on mobile", len(small)==0, str(small))

    check("no console errors/warnings (desktop)", not errors, "; ".join(errors)[:300])
    check("no console errors/warnings (mobile)", not merr, "; ".join(merr)[:300])
    b.close()

fails=[r for r in results if not r[1]]
print(f"\n{len(results)-len(fails)}/{len(results)} passed")
sys.exit(1 if fails else 0)
