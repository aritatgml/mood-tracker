const images = import.meta.glob("../../assets/mocca_emotions/*.png", {
  eager: true,
  import: "default",
});

const byId = Object.fromEntries(
  Object.entries(images).map(([path, url]) => [
    path.split("/").pop().replace(".png", ""),
    url,
  ]),
);

//Emotion names
export default function Cloud({ emotionId, className = "" }) {
  const src = byId[emotionId];
  if (!src) return null;
  return <img className={`cloud ${className}`} src={src} alt="" />;
}