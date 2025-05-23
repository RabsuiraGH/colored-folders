Hooks.on("renderSidebarTab", (directory, html) => {
  if (!html) return;
  if (directory.tabName === "chat") return;

  const palette = [
    "#e63946",
    "#f1fa8c",
    "#a8dadc",
    "#457b9d",
    "#2a9d8f",
    "#ff6b6b"
  ];

  let randomizeButton = `
    <a class="header-control" id="colorize-all-folders" title="Randomize All Folder Colours">
        <i class="fas fa-dice"></i>
    </a>`;
  const search = html[0]?.querySelector(`input[name="search"]`);
  search?.insertAdjacentHTML("afterend", randomizeButton);

  html[0]?.querySelector("#colorize-all-folders")?.addEventListener("click", () => {
    randomizeAllFolders(directory);
  });
});

async function randomizeAllFolders(directory) {
    let updates = directory.folders.map((i) => {
        const color = Color.fromHSV([Math.random(), Math.random() * 0.2 + 0.7, Math.random() * 0.2 + 0.7]).css;
        return { _id: i.id, color: color };
    });

    await Folder.updateDocuments(updates);
}