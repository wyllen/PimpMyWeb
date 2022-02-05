const img = document.querySelector(
  ".portail-droite .accueil_2017_cadre:last-child img"
);
const getX2Src = (srcset) => {
  const imgSrcX2 = srcset.split(",").pop();
  return imgSrcX2.replace(" 2x", "");
};

if (img) {
  img.src = getX2Src(
    document.querySelector(".portail-droite .accueil_2017_cadre:last-child img")
      .srcset
  );
}

const pageMainImg = document.querySelector("#mw-content-text .thumb img");
if (pageMainImg) {
  const pageMainImgSrcX2 = getX2Src(pageMainImg.srcset);
  console.log("pageMainImgSrcX2", pageMainImgSrcX2);
  document
    .querySelector(".mw-body-header")
    .setAttribute("style", "--header-page-bg: url(" + pageMainImgSrcX2 + ")");
} else {
  const pageMainImg = document.querySelector(".infobox_v3 .images img");
  if (pageMainImg) {
    const pageMainImgSrcX2 = getX2Src(pageMainImg.srcset);
    console.log("pageMainImgSrcX2", pageMainImgSrcX2);
    document
      .querySelector(".mw-body-header")
      .setAttribute("style", "--header-page-bg: url(" + pageMainImgSrcX2 + ")");
  }
}
