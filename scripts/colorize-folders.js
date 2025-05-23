const MODULE = "colored-folders";

Hooks.once("init", () => {
  game.settings.register(MODULE, "palette", {
    name: "Color palette",
    scope: "world",
    config: false,
    type: Array,
  });

  game.settings.registerMenu(MODULE, "paletteMenu", {
    name: "Palette editor",
    label: "Open palette editor",
    icon: "fas fa-palette",
    type: PaletteSettingConfig,
    restricted: true
  });
});

Hooks.on("renderSidebarTab", (directory, html) => {
  if (!html || directory.tabName === "chat") return;

  const randomizeButton = `
    <a class="header-control" id="colorize-all-folders" title="Color all folders">
      <i class="fas fa-dice"></i>
    </a>`;
  html[0]?.querySelector(`input[name="search"]`)?.insertAdjacentHTML("afterend", randomizeButton);

  html[0]?.querySelector("#colorize-all-folders")?.addEventListener("click", () => {
    randomizeAllFolders(directory);
  });
});

async function randomizeAllFolders(directory) {
  const palette = game.settings.get(MODULE, "palette");
  const folders = directory.folders;


  const childrenMap = new Map();
  for (const folder of folders) {
    const parentId = folder.folder?.id ?? null;
    if (!childrenMap.has(parentId)) childrenMap.set(parentId, []);
    childrenMap.get(parentId).push(folder);
  }

  const updates = [];

  function assignColors(parentId = null, parentColor = null) {
    const siblings = childrenMap.get(parentId);
    if (!siblings) return;

    let colorIndex = 0;
    for (const folder of siblings) {
      let availableColors = palette.slice();

      if (parentColor) {
        availableColors = availableColors.filter(c => c !== parentColor);
      }

      const color = availableColors[colorIndex % availableColors.length];
      colorIndex++;

      updates.push({ _id: folder.id, color });

      assignColors(folder.id, color);
    }
  }

  assignColors();

  await Folder.updateDocuments(updates);
}

// -----------------------------
// Palette Settings Form Class
// -----------------------------

class PaletteSettingConfig extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Palete editor",
      id: "palette-setting-config",
      template: `modules/${MODULE}/templates/palette-settings.html`,
      width: 400,
      height: "auto",
      closeOnSubmit: true,
    });
  }

  getData() {
    const palette = game.settings.get(MODULE, "palette") || [];
    return { palette };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("#add-color").on("click", () => {
      const idx = html.find(".palette-item").length;
      const newInput = $(`
        <div class="palette-item">
          <input type="color" name="color-${idx}" value="#ffffff"/>
          <button type="button" class="remove-color">✖</button>
        </div>
      `);
      html.find("#palette-list").append(newInput);
    });

    html.on("click", ".remove-color", function () {
      $(this).closest(".palette-item").remove();
    });
  }

  async _updateObject(_event, formData) {
    const colors = Object.values(formData);
    await game.settings.set(MODULE, "palette", colors);
  }
}
