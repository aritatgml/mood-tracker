export const emotionThemes = {
  happy:     { fill: "#fff0c2", edge: "#f5d98a", ink: "#D97800", noun: "happiness",   face: "happy",     pos: [50, 13] },
  sad:       { fill: "#e3ecfb", edge: "#bfd0f2", ink: "#0A47CA", noun: "sadness",     face: "sad",       pos: [20, 31] },
  surprised: { fill: "#e9edf4", edge: "#c9d0dd", ink: "#26313c", noun: "surprise",    face: "surprised", pos: [80, 31] },
  disgusted: { fill: "#e6f6d9", edge: "#c3e5a8", ink: "#5ABF38", noun: "disgust",     face: "disgusted", pos: [15, 60] },
  bad:       { fill: "#d9f6f3", edge: "#aee9e3", ink: "#00A28B", noun: "bad mood",    face: "bad",       pos: [85, 60] },
  angry:     { fill: "#fde6e4", edge: "#f7bfbb", ink: "#E44743", noun: "anger",       face: "angry",     pos: [33, 87] },
  fearful:   { fill: "#ffe9d9", edge: "#fbc9a6", ink: "#FF6023", noun: "fear",        face: "fearful",   pos: [67, 87] },
};

const fallback = { fill: "#eef2f4", edge: "#d3dbe0", ink: "#3d4452", noun: "feeling", face: "bad", pos: [50, 50] };

export const getTheme = (id) => emotionThemes[id] ?? fallback;
