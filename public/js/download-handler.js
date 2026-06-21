(function () {
  "use strict";

  var GITHUB_LATEST_RELEASE_URL =
    "https://api.github.com/repos/JUNIORPRUEVA/fullpos-releases/releases/latest";

  var GITHUB_DIRECT_DOWNLOAD_URL =
    "https://github.com/JUNIORPRUEVA/fullpos-releases/releases/latest/download/FullPOS-Setup.exe";

  var WHATSAPP_FALLBACK =
    "https://wa.me/18494314070?text=Hola,%20quiero%20descargar%20la%20demo%20de%20FullPOS";

  function startDownload(url) {
    window.location.assign(url);
  }

  function downloadLatestFullpos() {
    return fetch(GITHUB_LATEST_RELEASE_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Could not fetch latest release");
        }
        return response.json();
      })
      .then(function (release) {
        var assets = Array.isArray(release.assets) ? release.assets : [];

        var installer =
          assets.find(function (asset) {
            return (
              typeof asset.name === "string" &&
              asset.name.toLowerCase().endsWith(".exe") &&
              asset.name.toLowerCase().includes("fullpos")
            );
          }) ||
          assets.find(function (asset) {
            return (
              typeof asset.name === "string" &&
              asset.name.toLowerCase().endsWith(".exe")
            );
          });

        if (!installer || !installer.browser_download_url) {
          throw new Error("Installer not found");
        }

        startDownload(installer.browser_download_url);
      })
      .catch(function (error) {
        console.error("FullPOS download failed:", error);
        startDownload(GITHUB_DIRECT_DOWNLOAD_URL || WHATSAPP_FALLBACK);
      });
  }

  function setLoading(btn, loading) {
    var icon = btn.querySelector(".download-icon");
    var text = btn.querySelector(".download-text");
    var originalText = btn.getAttribute("data-original-text") || "Descargar Demo";

    if (loading) {
      btn.disabled = true;
      btn.classList.add("opacity-80", "cursor-wait");
      if (icon) {
        icon.outerHTML =
          '<svg class="download-icon animate-spin mr-1.5 h-4 w-4 sm:h-5 sm:w-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
      }
      if (text) {
        text.textContent = "Descargando...";
      }
    } else {
      btn.disabled = false;
      btn.classList.remove("opacity-80", "cursor-wait");
      if (icon) {
        icon.outerHTML =
          '<svg class="download-icon mr-1.5 h-4 w-4 sm:h-5 sm:w-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>';
      }
      if (text) {
        text.textContent = originalText;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".download-btn");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        setLoading(btn, true);
        downloadLatestFullpos().finally(function () {
          setLoading(btn, false);
        });
      });
    });
  });
})();
