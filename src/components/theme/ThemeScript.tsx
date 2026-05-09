const themeScript = `
(function () {
  try {
    var storageKey = "kd-global-theme";
    var storedPreference = localStorage.getItem(storageKey);
    var preference = storedPreference === "dark" || storedPreference === "light" ? storedPreference : "light";
    var resolvedTheme = preference === "dark" ? "dark" : "light";
    var root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolvedTheme;

    requestAnimationFrame(function () {
      root.classList.add("theme-ready");
    });
  } catch {
    document.documentElement.classList.add("light");
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.themePreference = "light";
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
