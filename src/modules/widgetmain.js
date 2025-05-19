var imageURL = "https://3dexperience2023x.solize.com/3dspace/webapps/YOHOHAMA_Report/assets/images/";
var _baseURL = "https://3dexperience2023x.solize.com/3dspace";

requirejs.config({
    paths: {
        ExcelJS: "https://3dexperience2023x.solize.com/3dspace/webapps/YOHOHAMA_Report/src/javascript/exceljs.min",
        jspdf: "https://3dexperience2023x.solize.com/3dspace/webapps/YOHOHAMA_Report/src/javascript/jspdf.umd.min",
        html2canvas: "https://3dexperience2023x.solize.com/3dspace/webapps/YOHOHAMA_Report/src/javascript/html2canvas.min",
        // Added for EPR Document Upload : Start
        xlsx: "https://3dexperience2023x.solize.com/3dspace/webapps/YOHOHAMA_Report/src/javascript/xlsx.full.min"
        // Added for EPR Document Upload : End
    },
}),
    define("ExelJsDependency", ["ExcelJS"], function (ExcelJS) {
        return ExcelJS;
    }),
    define("PDFJsDependency", ["jspdf"], function (jspdf) {
        return jspdf;
    }),
    define("HTMLCanvas", ["html2canvas"], function (html2canvas) {
        return html2canvas;
    }),

    // Added for EPR Document Upload : Start
    define("SOL/DocumentCreate/scripts/XLSX", ["xlsx"], function (XLSX) {
        return XLSX;
    });
// Added for EPR Document Upload : End

define("hellow", ["DS/WAFData/WAFData", "GenerateTPRPDF", "HTMLCanvas", "DS/DataDragAndDrop/DataDragAndDrop", "SOL/DocumentCreate/scripts/XLSX", "Solize/URLS", "Solize/SecurityContext", "Solize/DocumentsCreate/NotificationsUtil"], function (WAFData, GenerateTPRPDF, html2canvas, DataDnD, XLSX, URLS, SecurityContext, NotificationsUtil) {

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

            // Added for EPR Document Upload : Start
            widget.NotificationsUtil = new NotificationsUtil();
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
            var contentArea = myWidget.createContentArea();

            formContainer.appendChild(sideBar1);
            formContainer.appendChild(sideBar2);
            formContainer.appendChild(contentArea);

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

        createPrjMng: function () {


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

        createContentArea: function () {
            var contentArea = document.createElement("div");
            contentArea.className = "widget-content-area";
            return contentArea;
        },

        createSecondSidebar: function () {
            var sideBar2 = document.querySelector(".second-sidebar");
            sideBar2.style.display = "block";
        },

        toggleSecondSidebar: function (visible) {
            var sideBar2 = document.querySelector(".second-sidebar");
            sideBar2.style.display = visible ? "block" : "none";
        },

        showEPRCompButtons: function () {
            myWidget.createMainSkeleton("EPR Comparison Report (Excel)", myWidget.setBtnEPRComp);
        },

        showEPRRepButtons: function () {
            myWidget.createMainSkeleton(" EPR Report Configuration", myWidget.setBtnEPRRep);
        },

        showEPRRevButtons: function () {
            myWidget.createMainSkeleton(" EPR Review Configuration", myWidget.setBtnEPRRev);
        },

        showErpUplaod: function () {
            myWidget.createMainSkeleton("EPR Upload Configuration", myWidget.setBtnEPRUpload);
        },

        showTPRButtons: function () {
            myWidget.createMainSkeleton("TPR Configuration", myWidget.setBtnTPRDownload);
        },

        createMainSkeleton: function (_mainTitle, paramDIv) {
            var contentArea = document.querySelector(".widget-content-area");
            contentArea.innerHTML = "";
            var contentArea1 = document.createElement("div");
            contentArea1.className = "skeleton-panel";

            var titlediv = myWidget.titleERPDiv(_mainTitle);
            var contentContainer = myWidget.mainERPdiv(paramDIv);
            contentArea1.appendChild(titlediv);
            contentArea1.appendChild(contentContainer);
            contentArea.appendChild(contentArea1);
        },

        mainERPdiv: function (paramDIv) {
            const mainBodyDiv = this.createDiv("facetviews");
            const genericDetail = this.createDiv("generic-detail");
            const mainParamDiv = this.createDiv("", "mainParamDiv");
            const mainTitleDiv = this.createDiv("", null, { height: "5%" });

            mainParamDiv.appendChild(mainTitleDiv);
            const parameterDiv = paramDIv();
            mainParamDiv.appendChild(parameterDiv);

            genericDetail.appendChild(mainParamDiv);
            mainBodyDiv.appendChild(genericDetail);

            return mainBodyDiv;
        },

        titleERPDiv: function (maintitlename) {
            const skeletonIdCnt = this.createDiv("skeleton-id-cnt");
            const idCard = this.createDiv("id-card without-banner without-thumbnail without-facets ready");
            const bannerSection = this.createDiv("banner-section");
            const mainSection = this.createDiv("main-section");
            const infoAndThumbnailSection = this.createDiv("info-and-thumbnail-section");
            const thumbnailSection = this.createDiv("thumbnail-section");
            const infoSection = this.createDiv("info-section");
            const headerSection = this.createDiv("header-section");
            const titleSection = this.createDiv("title-section");
            const title = document.createElement("h1");
            const span = document.createElement("span");
            span.textContent = maintitlename;
            title.appendChild(span);
            titleSection.appendChild(title);

            const actionsSection = this.createDiv("actions-section");
            headerSection.appendChild(titleSection);
            headerSection.appendChild(actionsSection);

            const detailedInfoSection = this.createDiv("detailed-info-section");
            const ownerNameSection = this.createDiv("owner-name-section");
            infoSection.appendChild(headerSection);
            infoSection.appendChild(detailedInfoSection);

            infoAndThumbnailSection.appendChild(thumbnailSection);
            infoAndThumbnailSection.appendChild(infoSection);

            mainSection.appendChild(infoAndThumbnailSection);

            idCard.appendChild(bannerSection);
            idCard.appendChild(mainSection);

            skeletonIdCnt.appendChild(idCard);

            document.body.appendChild(skeletonIdCnt);

            return skeletonIdCnt;
        },

        setBtnEPRComp: function () {

            return myWidget.paramERPDiv(myWidget.EPRCompFun);

        },
        setBtnEPRRep: function () {
            return myWidget.paramERPDiv(myWidget.EprRepFun);

        },

        setBtnEPRRev: function () {
            return myWidget.paramERPDiv(myWidget.btnEmpytFun);

        },

        setBtnEPRUpload: function () {

            return myWidget.paramERPUpoad();

        },
        setBtnTPRDownload: function () {
            return myWidget.paramERPDiv(myWidget.TPRPdfFun);

        },



        paramERPUpoad() {
            const div1 = this.createDiv("scroller scroller-root", "parametersDiv");
            const div2 = this.createDiv("no-native-scrollbars scroller-content");
            const div3 = this.createDiv("divided filled accordion accordion-root");
            div3.appendChild(myWidget.parmERPUploadcontent());
            div2.appendChild(div3);
            div1.appendChild(div2);

            return div1;

        },

        paramERPDiv: function (btnonclickFun) {
            const div1 = this.createDiv("scroller scroller-root", "parametersDiv");
            const div2 = this.createDiv("no-native-scrollbars scroller-content");
            const div3 = this.createDiv("divided filled accordion accordion-root");
            div3.appendChild(myWidget.parmERPDownloadcontent("file-type-excel.svg", btnonclickFun));
            div2.appendChild(div3);
            div1.appendChild(div2);

            return div1;
        },

        parmERPUploadcontent: function () {
            const div4 = this.createDiv("accordion-item active");
            const accordionTitle = this.createDiv("accordion-title");
            const caretIcon = this.createElementWithClass("i", "caret-left");
            const titleText = document.createTextNode("Upload Document Configuration");
            accordionTitle.appendChild(caretIcon);
            accordionTitle.appendChild(titleText);
            div4.appendChild(accordionTitle);

            const contentWrapper = this.createDiv("content-wrapper");
            const contentDiv = this.createDiv("content");
            const div = document.createElement('div');
            div.className = 'enox-import-template-download';

            // Create the img element
            const img = document.createElement('img');
            img.src = imageURL + 'I_DownloadTemplete.png';

            // Add image and text to the div
            div.appendChild(img);
            div.appendChild(document.createTextNode('\u00A0Download\u00A0Template'));

            // Append to the body or any container
            contentDiv.appendChild(div);

            const table = this.createElementWithClass("table", "table-hover");
            const tbody = this.createElementWithClass("tbody", "fparamtbody");
            const tr = document.createElement("tr");

            tr.appendChild(this.createTableCell("20%", "left", "p", "Upload Document", "16px"));
            tr.appendChild(this.createFileInputCell("25%"));
            tr.appendChild(this.createButtonCellUpload("25%", "upload.png", "Upload Selected File", "Upload"));

            tbody.appendChild(tr);
            table.appendChild(tbody);
            contentDiv.appendChild(table);
            contentWrapper.appendChild(contentDiv);

            div4.appendChild(contentWrapper);

            return div4;
        },

        parmERPDownloadcontent: function (downloadIcon, btnonclickFun) {
            const div4 = this.createDiv("accordion-item active");
            const accordionTitle = this.createDiv("accordion-title");
            const caretIcon = this.createElementWithClass("i", "caret-left");
            const titleText = document.createTextNode("Download Document Configuration");
            accordionTitle.appendChild(caretIcon);
            accordionTitle.appendChild(titleText);
            div4.appendChild(accordionTitle);

            const contentWrapper = this.createDiv("content-wrapper");
            const contentDiv = this.createDiv("content");

            contentDiv.appendChild(myWidget.dragAndDropFile());
            contentWrapper.appendChild(contentDiv);

            const btnContainerdiv = this.createElementWithClass('div', 'btnContainerdiv');

            const downloadPopupbtn = this.createDiv("downloadPopup");
            downloadPopupbtn.id = "downloadPopup";
            const loaderdiv = this.createDiv("spinner");
            const downladptag = document.createElement('p');
            downladptag.textContent = "Downloading........";

            downloadPopupbtn.appendChild(loaderdiv);
            downloadPopupbtn.appendChild(downladptag)
            btnContainerdiv.appendChild(downloadPopupbtn);

            btnContainerdiv.appendChild(this.createButtonCell("downloadIcon.png", "Download Selected File", "Download", btnonclickFun));
            contentDiv.appendChild(btnContainerdiv);

            div4.appendChild(contentWrapper);

            return div4;
        },

        createDiv: function (classNames, id, styles = {}) {
            const div = document.createElement("div");
            if (classNames) div.classList.add(...classNames.split(" "));
            if (id) div.id = id;
            for (const [key, value] of Object.entries(styles)) {
                div.style[key] = value;
            }
            return div;
        },

        createElementWithClass: function (tag, classNames) {
            const element = document.createElement(tag);
            if (classNames) element.classList.add(...classNames.split(" "));
            return element;
        },

        createTableCell: function (width, align, elementType, textContent, fontSize, additionalClasses) {
            const td = document.createElement("td");
            td.setAttribute("width", width);
            td.setAttribute("align", align);

            const element = document.createElement(elementType);
            if (textContent) element.textContent = textContent;
            if (textContent) element.style.marginLeft = "20px";
            if (fontSize) element.style.fontSize = fontSize;
            if (additionalClasses) element.classList.add(...additionalClasses.split(" "));

            td.appendChild(element);
            return td;
        },

        createEMPtySpacetr: function () {
            const td = document.createElement("td");
            td.setAttribute("width", width);
        },

        createFileInputCell: function (width) {
            const td = document.createElement("td");
            td.setAttribute("width", width);
            td.setAttribute("align", "center");

            const inputWrapper = this.createDiv("xml-file-input uwa-file uwa-file-root uwa-input uwa-input-root", "ImportFileInput");
            inputWrapper.style.width = "250px";

            const inputFile = document.createElement("input");
            inputFile.setAttribute("type", "file");
            inputFile.setAttribute("accept", ".xls,.xlsx");
            inputFile.classList.add("xml-file-input", "uwa-file-input", "uwa-input-input", "hidden-input");
            // Added for EPR Document Upload : Start
            inputFile.addEventListener("change", async function (event) {

                const selectedFile = event.target.files[0];



                // Get the file name
                const fileName = selectedFile.name;

                document.querySelector("#fileName").textContent = this.files[0].name;

                if (fileName != "") {
                    inputFile.id = "inputFile";
                }


                var reader = new FileReader();
                reader.readAsArrayBuffer(event.target.files[0]);
                reader.onload = async function (event) {


                    var work_book = XLSX.read(reader.result);
                    var sheet_name = work_book.SheetNames;
                    var tempData = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });
                   
                    fetch(vSpaceURL + '/webapps/YOHOHAMA_Report/assets/layout.json')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();

                        })
                        .then(data => {
                            const Pages = data[0].pages;
                            var attributeArrays = [];

                            Pages.forEach(page => {
                                attributeArrays = attributeArrays.concat(page.cells.filter(cell => cell.type === "Attribute"));
                            }
                            );

                            var vFinalDataAttributes = [];
                
                            attributeArrays.forEach(attribute => {


                                var cellRowPosition = attribute.rowStart;
                                var cellColumnPosition = attribute.colStart;
                                var attrValue = tempData[cellRowPosition][cellColumnPosition];

                                if ((null == attrValue) || (undefined == attrValue)) {
                                    attrValue = "";
                                } else {
                                    attrValue = attrValue.toString();
                                }

                                var attrName = attribute.value;

                                if ((null == attrName) || (undefined == attrName)) {
                                    attrName = "";
                                }

                                vFinalDataAttributes.push({ "attrName": attrName, "attrValue": attrValue });

                            });

                            vFinalDataAttributesGlobal = vFinalDataAttributes;



                        }
                        )
                        .catch(error => console.error('Failed to fetch data:', error));
                }
            });

            inputFile.addEventListener("cancel", function (event) {
                event.target.files[0] = "";
                vData = [];
                document.querySelector("#fileName").textContent = "";

            });

            // Added for EPR Document Upload : End

            const divContent = this.createDiv("xml-file-input uwa-file-content uwa-input-content xml-file-input uwa-file-split uwa-input-split");
            const divText = this.createDiv("xml-file-input uwa-file-text uwa-input-text");
            divText.innerHTML = "&nbsp;";
            divText.id = "fileName";

            const divButton = this.createDiv("xml-file-input uwa-file-button uwa-input-button");
            divButton.textContent = "Browse...";

            divContent.appendChild(divText);
            divContent.appendChild(divButton);
            inputWrapper.appendChild(inputFile);
            inputWrapper.appendChild(divContent);
            td.appendChild(inputWrapper);

            return td;
        },

        createButtonCell: function (iconClass, title, buttonText, btnonclickFun) {

            const button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("title", title);
            button.classList.add("btn-primary", "btn", "btn-root", "btn-with-icon");
            button.style.width = "190px";

            const buttonIcon = document.createElement("img");
            buttonIcon.src = imageURL + iconClass;
            buttonIcon.className = "arro_icon_style";
            buttonIcon.alt = "Arrow Icon";
            buttonIcon.style.width = "10";
            buttonIcon.style.height = "10px";
            buttonIcon.style.marginRight = "10px";
            buttonIcon.style.alignItems = "left";
            const buttonTextNode = document.createTextNode(buttonText);
            const caretSpan = this.createElementWithClass("span", "caret");

            button.appendChild(buttonIcon);
            button.appendChild(buttonTextNode);
            button.appendChild(caretSpan);

            if (btnonclickFun) {
                button.addEventListener("click", btnonclickFun);
            }
            return button;
        },

        createButtonCellUpload: function (width, iconClass, title, buttonText, btnonclickFun) {
            const td = document.createElement("td");
            td.setAttribute("width", width);
            td.setAttribute("align", "left");

            const button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("title", title);
            button.classList.add("btn-primary", "btn", "btn-root", "btn-with-icon");
            button.style.width = "190px";

            const buttonIcon = document.createElement("img");
            buttonIcon.src = imageURL + iconClass;
            buttonIcon.className = "arro_icon_style";
            buttonIcon.alt = "Arrow Icon";
            buttonIcon.style.width = "10";
            buttonIcon.style.height = "10px";
            buttonIcon.style.marginRight = "10px";
            buttonIcon.style.alignItems = "left";
            const buttonTextNode = document.createTextNode(buttonText);
            const caretSpan = this.createElementWithClass("span", "caret");

            button.appendChild(buttonIcon);
            button.appendChild(buttonTextNode);
            button.appendChild(caretSpan);
            td.appendChild(button);

            // Added for EPR Document Upload : Start

            /* if (btnonclickFun) {
                 button.addEventListener("click", btnonclickFun);
             }*/


            if (title == "Upload Selected File") {

                button.addEventListener("click", function (e) {

                    var fileName = document.getElementById("fileName").textContent;
                    fileName = fileName.trim();

                    if (fileName == "") {
                        alert("Kindly browse the xlsx file first.");
                    }

                    if (fileName != "") {

                        button.disabled = true;
                        button.id = "xlsuploadButton";
                        document.querySelector("#inputFile").disabled = true;

                        myWidget.createDocuments(vFinalDataAttributesGlobal);
                        vFinalDataAttributesGlobal = [];



                    }

                });

            }

            // Added for EPR Document Upload : End

            return td;
        },

        // Added for EPR Document Upload : Starts
        createDocuments: function (vFinalDataAttributes) {

            var vFinalPostBody = {};
            var vFinalData = {};

            var vDataWeb = [];


            var vDataElements = {};

            var vDocumentIndividual = {};
            vDataElements.policy = "Document Release";
            vDataElements.state = "IN_WORK";
            vDataElements.title = "EPR Details";
            vDataElements.description = "EPR Details";
            vDataElements.collabspace = vCollbSpace;
            vDataElements.extensions = ["IPML.Automatic"];
            vDocumentIndividual.type = "Document";
            vDocumentIndividual.dataelements = vDataElements;
            vDataWeb.push(vDocumentIndividual);


            if (vDataWeb.length > 0) {
                widget.NotificationsUtil.handler().addNotif({ level: 'success', subtitle: "File has been uploaded successfully.Please wait till the Document is getting generated !!", sticky: true });

                vFinalData.data = vDataWeb;



                myWidget.getCSRFToken().then(csrfToken => {
                    myWidget.callDocWebservice(vFinalData, csrfToken).then(docsData => {


                        var vDocPid = docsData[0].identifier;

                        const vDocName = docsData[0].dataelements.name;
                        vFinalPostBody.docIdentifier = vDocPid;

                        vFinalPostBody.attributeDetails = vFinalDataAttributes;


                        myWidget.updateDocAttributes(vFinalPostBody).then(success => {


                            if (success.status == "No Error") {
                                widget.NotificationsUtil.handler().addNotif({ level: 'success', subtitle: "Document " + vDocName + " got created successfully!!", sticky: true });
                                document.getElementById("xlsuploadButton").disabled = false;

                                document.querySelector("#fileName").textContent = "";
                                document.querySelector("#inputFile").disabled = false;
                                document.getElementById("xlsuploadButton").disabled = false;


                            }

                        });


                    });

                });



            }


        },

        updateDocAttributes: function (vData) {


            return new Promise(function (i, a) {
                var vURL = vSpaceURL + "/DSDocuments/postFormParam";
                WAFData.authenticatedRequest(vURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"



                    },
                    data: JSON.stringify(vData),
                    responseType: "json",
                    timeout: 0,

                    onComplete: function (e) {
                        console.log("::e::", e);
                        i(e);

                    },
                    onFailure: function (e) {
                        console.log(":::failure:::", e);
                    }
                });

            });


        },

        getCSRFToken: function () {
            return new Promise(function (i, a) {
                var vURL = vSpaceURL + "/resources/v1/application/CSRF";

                WAFData.authenticatedRequest(vURL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "SecurityContext": vSecContextGlobal



                    },
                    responseType: "json",

                    onComplete: function (e) {

                        i(e.csrf.value);

                    },
                    onFailure: function (e) {
                        console.log(":::failure:::", e);
                    }
                });

            });
        },

        callDocWebservice: function (vFinalData, csrfToken) {
            return new Promise(function (i, a) {
                var vURL = vSpaceURL + "/resources/v1/modeler/documents";

                WAFData.authenticatedRequest(vURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "ENO_CSRF_TOKEN": csrfToken,
                        "SecurityContext": vSecContextGlobal


                    },
                    timeout: 0,
                    responseType: "json",
                    data: JSON.stringify(vFinalData),
                    onComplete: function (e) {
                        i(e.data);

                    },
                    onFailure: function (e) {
                        console.log(":::failure:::", e);
                    }
                });


            });
        },
        // Added for EPR Document Upload : End



        EPRCompFun: function () {

            console.log("Download button clicked");
            const chips = document.querySelectorAll('.YATG_wux-controls-selectionChips .YATG_wux-chip-cell-label');
            const selectedIds = Array.from(chips).map(chip => chip.id);

            if (selectedIds.length === 0) {
                alert("Please drop at least one document.");
                return;
            }

            const objectIds = selectedIds.join(",");
            const apiUrl = `https://3dexperience2023x.solize.com/3dspace/resources/v1/bookmarkeditor/documentattributes/generatexcel?objectIds=${objectIds}`;
            var methodWAF = "GET";
            const popup = document.getElementById("downloadPopup");
            if (popup) popup.style.display = "flex"; // Show popup

            try {
                var responses = WAFData.authenticatedRequest(apiUrl, {

                    method: methodWAF,
                    type: "json",
                    params: {
                        current: "true",
                        select: "collabspaces",
                    },
                });

                const xhr = responses.xhr;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (popup) popup.style.display = "none";
                        if (xhr.status === 200) {
                            const res = JSON.parse(xhr.response);
                            console.log(res);
                            console.log(res.downloadUrl);

                        } else {
                            console.error("Request failed with status:", xhr.status);
                        }
                    }
                };

                //alert("Exel downloaded in C:/Users/Administrator/Desktop/JPOS/");

            } catch (error) {
                console.log(error)
                if (popup) popup.style.display = "none";
            }
        },

        btnEmpytFun: function () {
            console.log("icon clicked");
        },

        EprRepFun: function () {
            console.log("Download button clicked");
            const chips = document.querySelectorAll('.YATG_wux-controls-selectionChips .YATG_wux-chip-cell-label');
            const selectedIds = Array.from(chips).map(chip => chip.id);

            if (selectedIds.length === 0) {
                alert("Please drop at least one document.");
                return;
            }

            const objectIds = selectedIds.join(",");
            const apiUrl = `https://3dexperience2023x.solize.com/3dspace/resources/v1/bookmarkeditor/documentattributes/generateexcelbyjson?id=${objectIds}`;
            const methodWAF = "GET";

            const popup = document.getElementById("downloadPopup");
            if (popup) popup.style.display = "flex"; // Show popup

            try {
                fetch(apiUrl, {
                    method: 'GET',
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('Response status:', response.status);

                            const a = document.createElement('a');
                            a.href = apiUrl;
                            a.download = '';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            if (popup) popup.style.display = "none";
                        } else {
                            console.log('Response status:', response.status);
                            console.error('Failed to download. Status:', response.status);
                            if (popup) popup.style.display = "none";

                        }
                    })

            } catch (error) {
                console.error("Error during request:", error);
                if (popup) popup.style.display = "none";
            }
        },

        TPRPdfFun: function () {
            const chips = document.querySelectorAll('.YATG_wux-controls-selectionChips .YATG_wux-chip-cell-label');
            const selectedIds = Array.from(chips).map(chip => chip.id);

            if (selectedIds.length !== 1) {
                alert("Please select only one item.");
                return;
            }


            const objectIds = selectedIds.join(",");
            const apiUrl = `https://3dexperience2023x.solize.com/3dspace/resources/v1/bookmarkeditor/documentattributes/tprattributes?objectIds=${objectIds}`;
            const methodWAF = "GET";

            const popup = document.getElementById("downloadPopup");
            if (popup) popup.style.display = "flex"; // Show popup

            try {
                const responses = WAFData.authenticatedRequest(apiUrl, {
                    method: methodWAF,
                    type: "json",
                    params: {
                        current: "true",
                        select: "collabspaces",
                    },
                });

                const xhr = responses.xhr;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (popup) popup.style.display = "none"; // Hide popup

                        if (xhr.status === 200) {
                            const res = JSON.parse(xhr.response);
                            const data = res.documents[0];
                            GenerateTPRPDF.createTRPPdfTable(data);
                        } else {
                            console.error("Request failed with status:", xhr.status);
                            alert("Failed to fetch data.");
                        }
                    }
                };

            } catch (error) {
                console.error(error);
                alert("Error in Generating PDF :)");
                if (popup) popup.style.display = "none"; // Hide on error
            }
        },



        dragAndDropFile: function () {
            const maincont = document.createElement("div");

            const parentDiv = document.createElement('div');
            parentDiv.classList.add('chg-add-member-assignee-field');

            const controlsDiv = document.createElement('div');
            controlsDiv.classList.add('YATG_wux-controls-abstract', 'YATG_wux-controls-autoComplete');

            const selectionChipsDiv = document.createElement('div');
            selectionChipsDiv.classList.add('YATG_wux-controls-abstract', 'YATG_wux-controls-selectionChips', 'YATG_wux-controls-autoComplete-selectionChips');
            selectionChipsDiv.setAttribute('has-menu', 'true');

            function createChipCell(labelText, docId) {

                const chipContainer = document.createElement('div');
                chipContainer.classList.add('YATG_wux-chip-cell-container');
                chipContainer.setAttribute('draggable', 'true');

                const img = document.createElement('img');
                img.id = 'imgid1';
                img.src = imageURL + 'document_888108.png';
                img.alt = '';

                const label = document.createElement('li');
                label.classList.add('YATG_wux-chip-cell-label');
                label.id = docId;
                label.textContent = labelText;

                const closeButton = document.createElement('li');
                closeButton.classList.add('YATG_wux-chip-cell-close', 'YATG_wux-ui-3ds', 'YATG_wux-ui-3ds-1x', 'YATG_wux-ui-3ds-close');

                const closeImg = document.createElement('img');
                closeImg.id = 'imgid';
                closeImg.src = imageURL + 'iconActionDelete.png';
                closeImg.alt = '';

                closeImg.addEventListener('click', function () {
                    chipContainer.remove();
                });

                closeButton.appendChild(closeImg);
                chipContainer.appendChild(img);
                chipContainer.appendChild(label);
                chipContainer.appendChild(closeButton);

                return chipContainer;
            }

            const lastWidgetDiv = document.createElement('div');
            lastWidgetDiv.classList.add('YATG_wux-controls-lastWidget-selectionChips');

            controlsDiv.appendChild(selectionChipsDiv);
            controlsDiv.appendChild(lastWidgetDiv);

            parentDiv.appendChild(controlsDiv);

            const addedObjectIds = new Set();

            DataDnD.droppable(parentDiv, {
                enter: function (el, event) {
                    el.classList.add("drag-over");
                },
                over: function (el, event) {
                    return true;
                },
                leave: function (el, event) {
                    el.classList.remove("drag-over");
                },
                drop: function (data, el, event) {
                    const res = JSON.parse(data);
                    console.log(res);

                    res.data.items.forEach(item => {
                        const displayName = item.displayName;
                        const objectId = item.objectId;
                        if (!addedObjectIds.has(objectId)) {
                            const chip = createChipCell(displayName, objectId);
                            selectionChipsDiv.appendChild(chip);
                            addedObjectIds.add(objectId);
                        } else {
                            console.log(`Duplicate drop ignored for objectId: ${objectId}`);
                        }
                    });
                }
            });
            maincont.appendChild(parentDiv);

            return maincont;
        },
    };

    return myWidget;
});


define('GenerateTPRPDF', ["PDFJsDependency"], function (jspdf) {
    return {
        createTRPPdfTable: function (data) {

            const pdfbodyDiv = document.createElement('div');
            const pdfContent = document.createElement("div");
            pdfContent.id = "pdfContent";

            const table = document.createElement("table");
            table.id = "pdftable";

            function createCell(content, colspan = 1, rowspan = 1, style = "", isHeader = false) {
                const cell = isHeader ? document.createElement("th") : document.createElement("td");
                cell.colSpan = colspan;
                cell.rowSpan = rowspan;
                cell.id = "pdftdstyle"
                if (style) cell.setAttribute("style", style);
                cell.innerHTML = content;
                return cell;
            }

            const row1 = document.createElement("tr");
            row1.appendChild(createCell("Test Protocol Request", 14, 1, "font-size: 20px; font-weight:bold;background-color: rgb(255, 255, 87);text-align: center;"));
            table.appendChild(row1);

            const row2 = document.createElement("tr");
            row2.appendChild(createCell('<img style="width: 100px;text-align:left" src="https://3dexperience2023x.solize.com/3dspace/webapps/YOHOHAMA_Report/assets/images/OIP.jpg" >', 10, 3));
            row2.appendChild(createCell("TPR NO", 2, 1));
            row2.appendChild(createCell(data.YATG_TPR_TPRNumber, 2, 1, "font-weight: bold;background-color: rgb(255, 255, 87)", true));
            table.appendChild(row2);

            const row3 = document.createElement("tr");
            row3.appendChild(createCell("Date of request", 2));
            row3.appendChild(createCell(data.YATG_TPR_DateOfRequest, 2, 1, "font-weight: bold;background-color: #e4dfec", true));
            table.appendChild(row3);

            const row4 = document.createElement("tr");
            row4.appendChild(createCell("Brand", 2));
            row4.appendChild(createCell(data.YATG_TPR_Brand, 2, 1, "font-weight: bold;background-color: #e4dfec", true));
            table.appendChild(row4);

            // Row 5
            const row5 = document.createElement("tr");
            row5.appendChild(createCell("To", 2));
            row5.appendChild(createCell(data.YATG_TPR_ToDepartment, 8, 1, "font-weight: bold;", true));
            row5.appendChild(createCell("CAT #", 2));
            row5.appendChild(createCell(data.YATG_TPR_CATNumber, 2, 1, "font-weight: bold;background-color: #e4dfec", true));
            table.appendChild(row5);

            // Row 6
            const row6 = document.createElement("tr");
            row6.appendChild(createCell("From", 2));
            row6.appendChild(createCell(data.YATG_TPR_FromDepartment, 8, 1, "font-weight: bold;", true));
            row6.appendChild(createCell("", 2));
            row6.appendChild(createCell("", 2));
            table.appendChild(row6);

            // Row 7
            const row7 = document.createElement("tr");
            row7.appendChild(createCell("Plant", 2));
            row7.appendChild(createCell(data.YATG_TPR_Plant, 8, 1, "font-weight: bold;", true));
            row7.appendChild(createCell("", 2));
            row7.appendChild(createCell("", 2));
            table.appendChild(row7);

            const row8 = document.createElement("tr");
            row8.appendChild(createCell("INITIATING DEPARTMENT", 5));
            row8.appendChild(createCell(data.YATG_TPR_InitatingDepartment, 9, 1, "background-color: #dce6f1"));
            table.appendChild(row8);

            const row9 = document.createElement("tr");
            row9.appendChild(createCell("Kind of request", 5));

            const requestType = data.YATG_TPR_KindOfRequest?.trim().toLowerCase();

            const highlightIfMatch = (label, colspan = 1) => {
                const isMatch = label.toLowerCase() === requestType;
                const style = isMatch ? "background-color: #92d050;" : "";
                return createCell(label, colspan, 1, style);
            };

            row9.appendChild(highlightIfMatch("BM"));
            row9.appendChild(highlightIfMatch("Proto"));
            row9.appendChild(highlightIfMatch("Redisign", 3));
            row9.appendChild(highlightIfMatch("Random", 2));
            row9.appendChild(highlightIfMatch("MISC", 2));

            table.appendChild(row9);


            // Row 10
            const row10 = document.createElement("tr");
            row10.appendChild(createCell("SUBJECT DETAILS", 3, 4));
            row10.appendChild(createCell("Size", 1));
            row10.appendChild(createCell(data.YATG_TPR_ProtoSize, 10, 1, "font-weight: bold;text-align: center;background-color: #e4dfec"));
            table.appendChild(row10);

            // Row 11
            const row11 = document.createElement("tr");
            row11.appendChild(createCell("Pattern", 1));
            row11.appendChild(createCell(data.YATG_TPR_ProtoPattern, 10, 1, "font-weight: bold;text-align: center;background-color: #e4dfec"));
            table.appendChild(row11);

            // Row 12
            const row12 = document.createElement("tr");
            row12.appendChild(createCell("Reason", 1));
            row12.appendChild(createCell(data.YATG_TPR_ProtoReason, 10, 1, "font-weight: bold;text-align: center;background-color: #e4dfec"));
            table.appendChild(row12);

            // Row 13
            const row13 = document.createElement("tr");
            row13.appendChild(createCell("PR / LI", 1));
            row13.appendChild(createCell(data.YATG_TPR_ProtoPRLI, 10, 1, "font-weight: bold;text-align: center;background-color: #e4dfec"));
            table.appendChild(row13);

            // Row 14
            const row14 = document.createElement("tr");
            row14.appendChild(createCell("Test tirt qty (Nos)", 5));
            row14.appendChild(createCell(data.YATG_TPR_ProtoTestTireQt, 10, 1, "text-align: center;background-color: #e4dfec"));
            table.appendChild(row14);

            // Row 15
            const row15 = document.createElement("tr");
            row15.appendChild(createCell("Test serial no Actual", 5));
            row15.appendChild(createCell("", 10, 1, "text-align: center;"));
            table.appendChild(row15);

            // Row 16
            const row16 = document.createElement("tr");
            row16.appendChild(createCell("Test plan", 5, 1, "background-color: #dce6f1"));
            row16.appendChild(createCell("Required / Not Required", 10, 1, "text-align: center;background-color: #dce6f1"));
            table.appendChild(row16);

            const row17 = document.createElement('tr');
            row17.appendChild(createCell(1, 1, 1, 'width: 50px;'));
            row17.appendChild(createCell('Uninflated dimension', 4, 1, 'width: 200px;'));
            row17.appendChild(createCell(data.YATG_TPR_ProtoUnInflatedDimension, 10, 1, 'text-align: center; width: 500px;'));
            table.appendChild(row17);

            const row18 = document.createElement('tr');
            row18.appendChild(createCell(2, 1));
            row18.appendChild(createCell('Inflated dimension analysis', 4));
            row18.appendChild(createCell(data.YATG_TPR_ProtoInflatedDimensionAnalysis, 10, 1, 'text-align: center;'));
            table.appendChild(row18);

            const row19 = document.createElement('tr');
            row19.appendChild(createCell(3, 1));
            row19.appendChild(createCell('Endurance', 4));
            row19.appendChild(createCell(data.YATG_TPR_ProtoBeltEndurance, 10, 1, 'text-align: center;'));
            table.appendChild(row19);

            const row20 = document.createElement('tr');
            row20.appendChild(createCell(5, 1));
            row20.appendChild(createCell('Deflection anlysis', 4));
            row20.appendChild(createCell(data.YATGTPRDeflectionAnalysis, 10, 1, 'text-align: center;'));
            table.appendChild(row20);

            const row21 = document.createElement('tr');
            row21.appendChild(createCell(6, 1));
            row21.appendChild(createCell('Adhesion ply/breaker', 4));
            row21.appendChild(createCell(data.YATG_TPR_ProtoAdhesionPlyBreaker, 10, 1, 'text-align: center;'));
            table.appendChild(row21);

            const row22 = document.createElement('tr');
            row22.appendChild(createCell(7, 1));
            row22.appendChild(createCell('Air leakage test', 4));
            row22.appendChild(createCell(data.YATG_TPR_ProtoAirLeakageTest, 10, 1, 'text-align: center;'));
            table.appendChild(row22);

            const row23 = document.createElement('tr');
            row23.appendChild(createCell(8, 1));
            row23.appendChild(createCell('Plunger test', 4));
            row23.appendChild(createCell(data.YATG_TPR_ProtoPlungerTest, 10, 1, 'text-align: center;'));
            table.appendChild(row23);

            const row24 = document.createElement('tr');
            row24.appendChild(createCell(9, 1));
            row24.appendChild(createCell('Compound Re Engg', 4));
            row24.appendChild(createCell(data.YATG_TPR_ProtoCompoundReEngg, 10, 1, 'text-align: center;'));
            table.appendChild(row24);

            const row25 = document.createElement('tr');
            row25.appendChild(createCell(11, 1));
            row25.appendChild(createCell('Cut Tire Analysis', 4));
            row25.appendChild(createCell(data.YATG_TPR_ProtoCutTireAnalysis, 10, 1, 'text-align: center;'));
            table.appendChild(row25);

            const row26 = document.createElement('tr');
            row26.appendChild(createCell(12, 1));
            row26.appendChild(createCell('RC meassurement', 4));
            row26.appendChild(createCell(data.YATG_TPR_ProtoRCMeasurement, 10, 1, 'text-align: center;'));
            table.appendChild(row26);

            const row27 = document.createElement('tr');
            row27.appendChild(createCell("YOHT/test targets", 5, 4))
            row27.appendChild(createCell("OD(mm)", 3, 1, "background-color: #dce6f1"));
            row27.appendChild(createCell('SW(mm)', 3, 1, "background-color: #dce6f1"));
            row27.appendChild(createCell('Inflation Pressure', 3, 1, "background-color: #dce6f1"));
            table.appendChild(row27);

            const row28 = document.createElement('tr');
            row28.appendChild(createCell(data.YATG_TPR_ProtoOD, 3));
            row28.appendChild(createCell(data.YATG_TPR_ProtoSW, 3));
            row28.appendChild(createCell(data.YATG_TPR_ProtoInflationPressure, 3));
            table.appendChild(row28);


            const row30 = document.createElement('tr');
            row30.appendChild(createCell("Load(Kgs)", 3, 1, "background-color: #dce6f1"));
            row30.appendChild(createCell('RIM Code', 3, 1, "background-color: #dce6f1"));
            row30.appendChild(createCell('RIM Width(inch)', 3, 1, "background-color: #dce6f1"));
            table.appendChild(row30);

            const row31 = document.createElement('tr');
            row31.appendChild(createCell(data.YATG_TPR_ProtoLoad, 3));
            row31.appendChild(createCell(data.YATG_TPR_ProtoRimCode, 3));
            row31.appendChild(createCell(data.YATG_TPR_ProtoRimWidth, 3));
            table.appendChild(row31);
            // Row 33
            const row33 = document.createElement("tr");
            row33.appendChild(createCell("Remarks: Please send all test reports to PDC", 14));
            table.appendChild(row33);

            // Row 34
            const row34 = document.createElement("tr");
            row34.appendChild(createCell("Requested by", 4));
            row34.appendChild(createCell("Rohith singh", 4));
            row34.appendChild(createCell("date", 4));
            row34.appendChild(createCell("date", 2));
            table.appendChild(row34);

            pdfContent.appendChild(table);
            pdfbodyDiv.appendChild(pdfContent);

            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.html(pdfContent, {
                callback: function (doc) {
                    doc.save(`${data.YATG_TPR_TPRNumber}.pdf`);
                },
                x: 5,
                y: 5,
                html2canvas: { scale: 0.23 },
                autoPaging: 'text',
                width: 190
            });
        },

    }
})

// Added for EPR Document Upload : Start

define("Solize/URLS", ['DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices'], function (i3DXCompassPlatformServices) {

    var URLs = {
        getURLs: function () {
            return new Promise(function (i, a) {
                i3DXCompassPlatformServices.getServiceUrl({
                    serviceName: '3DSpace',
                    onComplete: function (e) {


                        i(e[0]);
                    }
                });
            });
        },
    };
    return URLs;
});

define("Solize/SecurityContext", ['Solize/URLS', 'DS/WAFData/WAFData'], function (URLS, WAFData) {

    var vSecCont = {

        getSecurityContext: function () {


            return new Promise(function (t, i) {
                URLS.getURLs().then(results => {
                    WAFData.authenticatedRequest(results.url + "/resources/pno/person/getsecuritycontext?current=true&select=preferredcredentials&select=collabspaces", {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                        },
                        timeout: 864e5,
                        type: "json",
                        onComplete: function (e) {
                            t(e);


                        },
                        onFailure: function (e, t) {
                            var n = e.message;
                        },
                        onTimeout: function () {
                            console.log("time out")
                        },
                    });
                });

            });

        }
    };
    return vSecCont;
});

define('Solize/DocumentsCreate/NotificationsUtil', [
    'DS/Notifications/NotificationsManagerUXMessages',
    'DS/Notifications/NotificationsManagerViewOnScreen',
],
    function (NotificationsManagerUXMessages, NotificationsManagerViewOnScreen) {
        'use strict';
        let _notif_manager = null;
        let Notify = function () {
            _notif_manager = NotificationsManagerUXMessages;
            NotificationsManagerViewOnScreen.setNotificationManager(_notif_manager);
            NotificationsManagerViewOnScreen.setStackingPolicy(9); //To stack similar subject messages 
        };
        Notify.prototype.handler = function () {
            NotificationsManagerViewOnScreen.inject(document.body);
            return _notif_manager;
        };
        Notify.prototype.notifview = function () {
            return NotificationsManagerViewOnScreen;
        };
        return Notify;
    });
// Added for EPR Document Upload : End