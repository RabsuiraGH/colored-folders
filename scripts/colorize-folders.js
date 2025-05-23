Hooks.on("renderSidebarTab", (app, html) => {
  const palette = [
    "#e63946",
    "#f1fa8c",
    "#a8dadc",
    "#457b9d",
    "#2a9d8f",
    "#ff6b6b"
  ];

  html.find(".folder").each((i, el) => {
    const color = palette[i % palette.length];
    el.style.backgroundColor = color;
    el.style.color = "#fff";
  });
});
