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
            //var sideBar2 = myWidget.createSideBar2();
           // var contentArea = myWidget.createContentArea();

            formContainer.appendChild(sideBar1);
            //formContainer.appendChild(sideBar2);
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

            var tile1 = myWidget.createTileElement("Test Report Management", imageURL + "I_Switch.png", "Test Report Management", myWidget.createSecondSidebar);
            var tile2 = myWidget.createTileElement("Project Management", imageURL + "I_Switch.png", "Project Management", myWidget.createPrjMng);

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
