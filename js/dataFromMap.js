// import "https://js.arcgis.com/embeddable-components/4.32/arcgis-embeddable-components.esm.js";

// function findSiteNumber(node) {
//   if (!node) return null;

//   // If it's a shadow host, dive into shadow root
//   if (node.shadowRoot) {
//     return findSiteNumber(node.shadowRoot);
//   }

//   for (const child of node.childNodes) {
//     if (child.shadowRoot) {
//       console.log("into shadowroot", child.shadowRoot)

//       const result = findSiteNumber(child.shadowRoot);
//       if (result) return result;
//     }

//     if ( child.nodeType === 1 &&
//       child.classList.contains("calcite-flow-item")

//     ) {
//       console.log("calcite_flowitem", child.shadowRoot)
//     }

    

//     if (
//       child.nodeType === 1 &&
//       child.tagName === "TH" &&
//       child.classList.contains("esri-feature-fields__field-header") &&
//       child.textContent.trim() === "Site Number"
//     ) {

//       const td = child.nextElementSibling;
//       if (
//         td &&
//         td.tagName === "TD" &&
//         td.classList.contains("esri-feature-fields__field-data")
//       ) {
//         return td.textContent.trim();
//       }
//     }

//     const result = findSiteNumber(child);
//     if (result) return result;
//   }

//   return null;
// }

// window.addEventListener("DOMContentLoaded", () => {
//   const embeddedMap = document.querySelector("arcgis-embedded-map");

//   embeddedMap.addEventListener("arcgisViewClick", (evt) => {
//     const params = {
//       location: evt.detail.mapPoint
//     };

//     console.log("SCRAPE");

//     // setTimeout(() => {
//     //   const mapRoot = document.querySelector("#map");
//     //   const siteNumber = findSiteNumber(mapRoot);
//     //   console.log("Site Number:", siteNumber);
//     // }, 500); // 500ms delay — tweak this if needed
//   });
// });

// const observer = new MutationObserver((mutations, observer) => {
//   for (let mutation of mutations) {
//     const message = `<br><span>MutationObserver:</span> ${mutation.attributeName} has changed to
//       ${mutation.target[mutation.attributeName]}`;
//     displayMessage(message);
//   }
// });

// // Start observing the map's attributes
// observer.observe(arcgisMap, {
//   attributeFilter: ["updating"]
// });