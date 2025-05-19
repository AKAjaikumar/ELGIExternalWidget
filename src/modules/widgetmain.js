var imageURL = "https://akajaikumar.github.io/ELGIExternalWidget/assets/images/";
requirejs.config({
    paths: {
        jspdf: "https://akajaikumar.github.io/ELGIExternalWidget/src/javascript/jspdf.umd.min",
        autotable: "https://akajaikumar.github.io/ELGIExternalWidget/src/javascript/jspdf.plugin.autotable.min"

    },
}),
define("PDFJsDependency", ["jspdf"], function (jspdf) {
    return jspdf;
}),
define("PDFAutoTable", ["autotable"], function (autotable) {
    return autotable;
}),


define("hellow", ["DS/WAFData/WAFData", "DS/DataDragAndDrop/DataDragAndDrop", "Solize/URLS", "Solize/SecurityContext"], function (WAFData, DataDnD, URLS, SecurityContext) {

    // Added for EPR Document Upload : Start
    var vData = [];
    var vSpaceURL = "";
    var vSecContextGlobal = "";
    var vFinalDataAttributesGlobal = [];
    var vCollbSpace = "";
    // Added for EPR Document Upload : End

    var myWidget = {
        onLoadWidget: function () {
            widget.body.innerHTML = "";

            SecurityContext.getSecurityContext().then(secContext => {
                vSecContextGlobal = secContext.SecurityContext;
                vCollbSpace = vSecContextGlobal.split(".")[2];

                URLS.getURLs().then(spaceurl => {
                    vSpaceURL = spaceurl.url;
                    // Added for EPR Document Upload : End
                    var formContainer = myWidget.createFormContainer();
                    widget.body.appendChild(formContainer);
                });
            });
        },

        createFormContainer: function () {
            var formContainer = document.createElement("div");
            formContainer.className = "widget-container";

            var sideBar1 = myWidget.createSideBar1();
            var sideBar2 = myWidget.createSideBar2();
           // var contentArea = myWidget.createContentArea();

            formContainer.appendChild(sideBar1);
            formContainer.appendChild(sideBar2);
            //formContainer.appendChild(contentArea);

            return formContainer;
        },

        createSideBar1: function () {
            var sideBar1 = document.createElement("div");
            sideBar1.className = "widget-sidebar";

            var dummyspace = document.createElement("div");
            dummyspace.className = "dummysidespace";

            var firNavTitle = document.createElement("h2");
            firNavTitle.className = "secnavhead";
            firNavTitle.textContent = "Report Management";

            dummyspace.appendChild(firNavTitle);

            var sideBar1Ul = document.createElement("ul");
            sideBar1Ul.className = "sideBar1Ul";

            var tile1 = myWidget.createTileElement("Report 1", imageURL + "I_Switch.png", "Report 1", myWidget.createSecondSidebar);
            var tile2 = myWidget.createTileElement("Report 2", imageURL + "I_Switch.png", "Report 2", myWidget.createPrjMng);

            sideBar1.appendChild(dummyspace);

            var li1 = document.createElement("li");
            li1.className = "firnnavli";
            li1.appendChild(tile1);
            sideBar1Ul.appendChild(li1);

            var li2 = document.createElement("li");
            li2.appendChild(tile2);
            sideBar1Ul.appendChild(li2);

            sideBar1.appendChild(sideBar1Ul);

            return sideBar1;
        },
		createTileElement: function (title, imageSrc, subtitle, onclickFuncName) {
            var tileContainer = document.createElement("div");
            tileContainer.className = "tile-container";

            var tileSubContainer = document.createElement("div");
            tileSubContainer.className = "tile-sub-container";
            tileSubContainer.setAttribute("draggable", "true");

            var tileHeader = document.createElement("div");
            tileHeader.className = "tile-header";

            var img = document.createElement("img");
            img.src = imageSrc;
            img.className = "tile-image portrait";
            img.setAttribute("draggable", "false");

            tileHeader.appendChild(img);

            var tileBody = document.createElement("div");
            tileBody.className = "tile-body";

            var tileTitle = document.createElement("div");
            tileTitle.className = "tile-title";
            tileTitle.textContent = title;

            var tileSubtitle = document.createElement("div");
            tileSubtitle.className = "tile-subtitle";
            tileSubtitle.textContent = subtitle;

            tileBody.appendChild(tileTitle);
            tileBody.appendChild(tileSubtitle);

            tileSubContainer.appendChild(tileHeader);
            tileSubContainer.appendChild(tileBody);

            tileContainer.appendChild(tileSubContainer);

            tileContainer.addEventListener("click", function () {
                var currentSelected = document.querySelector(".tile-container.selected");
                if (currentSelected) {
                    currentSelected.classList.remove("selected");
                }

                tileContainer.classList.add("selected");

                onclickFuncName();
            });

            return tileContainer;
        },
		createSideBar2: function () {
            var sideBar2 = document.createElement("div");
            sideBar2.className = "second-sidebar";
            sideBar2.style.display = "none";

            var backArrow = myWidget.createBackArrow();
            sideBar2.appendChild(backArrow);

            var ul2 = myWidget.createSecondSidebarList();
            sideBar2.appendChild(ul2);

            return sideBar2;
        },

        createBackArrow: function () {
            var backArrow = document.createElement("div");
            backArrow.style.display = "flex";
            backArrow.style.alignItems = "center";
            backArrow.style.cursor = "pointer";

            var img = document.createElement("img");
            img.src = imageURL + "arrow.png";
            img.className = "arro_icon_style";
            img.alt = "Arrow Icon";
            img.style.width = "20px";
            img.style.marginRight = "10px";

            var secNavTitle = document.createElement("h2");
            secNavTitle.className = "secnavhead";
            secNavTitle.textContent = "Test Report Management";

            backArrow.appendChild(img);
            backArrow.appendChild(secNavTitle);

            backArrow.addEventListener("click", function () {
                myWidget.toggleSecondSidebar(false);
            });

            return backArrow;
        },

        createSecondSidebarList: function () {
            var ul2 = document.createElement("ul");

            var items = [
                { text: "EPR Comparison Report", image: imageURL + "I_AuthoringMode32.png", title: "EPR Comparison Report (Excel)", callback: myWidget.showEPRCompButtons },
                { text: "EPR Review", image: imageURL + "I_AuthoringMode32.png", title: "EPR Review(PDF)", callback: myWidget.showEPRRevButtons },
                { text: "EPR Report", image: imageURL + "I_AuthoringMode32.png", title: "EPR Report (Excel)", callback: myWidget.showEPRRepButtons },
                { text: "EPR Upload", image: imageURL + "I_AuthoringMode32.png", title: "Exel Upload", callback: myWidget.showErpUplaod },
                { text: "TPR", image: imageURL + "TPR_logo.png", title: "Product Report", callback: myWidget.showTPRButtons },
            ];

            items.forEach(function (item) {
                var listItem = myWidget.createSecondSidebarItem(item.text, item.image, item.title, item.callback);
                ul2.appendChild(listItem);
            });

            return ul2;
        },


        createSecondSidebarItem: function (title, imageSrc, subtitle, onclickFuncName) {
            var li = document.createElement("li");
            var tileContainer = document.createElement("div");
            tileContainer.className = "tile-container";

            var tileSubContainer = document.createElement("div");
            tileSubContainer.className = "tile-sub-container";
            tileSubContainer.setAttribute("draggable", "true");

            var tileHeader = document.createElement("div");
            tileHeader.className = "tile-header";

            var img = document.createElement("img");
            img.src = imageSrc;
            img.className = "tile-image portrait";
            img.setAttribute("draggable", "false");

            tileHeader.appendChild(img);

            var tileBody = document.createElement("div");
            tileBody.className = "tile-body";

            var tileTitle = document.createElement("div");
            tileTitle.className = "tile-title";
            tileTitle.textContent = title;

            var tileSubtitle = document.createElement("div");
            tileSubtitle.className = "tile-subtitle";
            tileSubtitle.textContent = subtitle;

            tileBody.appendChild(tileTitle);
            tileBody.appendChild(tileSubtitle);

            tileSubContainer.appendChild(tileHeader);
            tileSubContainer.appendChild(tileBody);

            tileContainer.appendChild(tileSubContainer);

            tileContainer.addEventListener("click", function () {
                var currentSelected = document.querySelector(".tile-container.selected");
                if (currentSelected) {
                    currentSelected.classList.remove("selected");
                }

                tileContainer.classList.add("selected");

                onclickFuncName();
            });

            li.appendChild(tileContainer);

            return li;
        },
		createSecondSidebar: function () {
            var sideBar2 = document.querySelector(".second-sidebar");
            sideBar2.style.display = "block";
        },
		createPrjMng: function () {


        },
		toggleSecondSidebar: function (visible) {
            var sideBar2 = document.querySelector(".second-sidebar");
            sideBar2.style.display = visible ? "block" : "none";
        },
    };

    return myWidget;
});

define("Solize/URLS", ['DS/i3DXCompassServices/i3DXCompassServices',], function (i3DXCompassServices) {
	const platformId = widget.getValue("x3dPlatformId");
    var URLs = {
        getURLs : function () {
            return new Promise(function (i, a) {
                i3DXCompassServices.getServiceUrl({
                            platformId: platformId,
                            serviceName: '3DSpace',
                            onComplete: function (URL3DSpace) {
                                let baseUrl = typeof URL3DSpace === "string" ? URL3DSpace : URL3DSpace[0].url;
                                if (baseUrl.endsWith('/3dspace')) {
                                    baseUrl = baseUrl.replace('/3dspace', '');
                                }
								console.log("Resolved Base URL:", baseUrl);
								i(baseUrl);
							},
                            onFailure: function () {
                                console.error("Failed to get 3DSpace URL");
                            }
                });
            });
        },
    };
	console.log("URLs:"+URLs);
    return URLs;
});

define("Solize/SecurityContext", ['Solize/URLS', 'DS/WAFData/WAFData'], function (URLS, WAFData) {
    var vSecCont = {
        getSecurityContext: function () {
            return new Promise(function (resolve, reject) {
                URLS.getURLs().then(baseUrl => {
					console.log("baseUrl:"+baseUrl);
                    const url = baseUrl + "/resources/pno/person/getsecuritycontext?current=true&select=preferredcredentials&select=collabspaces";
                    WAFData.authenticatedRequest(url, {
                        method: "GET",
                        headers: {
                            "Accept": "application/json"
                        },
                        timeout: 86400000,
                        type: "json",
                        onComplete: function (response) {
                            resolve(response);
                        },
                        onFailure: function (e, t) {
                            var n = e.message;
                        },
                        onTimeout: function () {
                            console.log("time out")
                        },
                    });
                }).catch(error => {
                    console.error("URL fetch failed:", error);
                    reject(error);
                });
            });
        }
    };

    return vSecCont;
});
