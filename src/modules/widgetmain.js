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


define("hellow", ["DS/WAFData/WAFData", "DS/DataDragAndDrop/DataDragAndDrop", "Solize/URLS", "Solize/SecurityContext","PDFJsDependency","PDFAutoTable"], function (WAFData, DataDnD, URLS, SecurityContext,jspdfModule, autotablePlugin) {

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

            var tile1 = myWidget.createTileElement("Reports", imageURL + "I_Switch.png", "Reports", myWidget.createSecondSidebar);
            var tile2 = myWidget.createTileElement("TPL Creation", imageURL + "I_Switch.png", "TPL Creation", myWidget.createPrjMng);

            sideBar1.appendChild(dummyspace);
			
			var li2 = document.createElement("li");
            li2.appendChild(tile2);
            sideBar1Ul.appendChild(li2);
			
            var li1 = document.createElement("li");
            li1.className = "firnnavli";
            li1.appendChild(tile1);
            sideBar1Ul.appendChild(li1);

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
		createSideBar3: function () {
            var sideBar3 = document.createElement("div");
            sideBar3.className = "third-sidebar";
            sideBar3.style.display = "none";

            var backArrow = myWidget.createBackArrow();
            sideBar2.appendChild(backArrow);

            var ul2 = myWidget.createSecondSidebarList();
            sideBar3.appendChild(ul2);

            return sideBar3;
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
                { text: "Generate Controlled Copy", image: imageURL + "I_AuthoringMode32.png", title: "Generate Controlled Copy (PDF)", callback: myWidget.showCtrlCopyButtons },
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
            let sideBar2 = document.querySelector(".second-sidebar");

			if (!sideBar2) {
				sideBar2 = document.createElement("div");
				sideBar2.className = "second-sidebar";
				document.body.appendChild(sideBar2);
			}


			sideBar2.innerHTML = "";
			sideBar2.style.display = "block";


			const backArrow = myWidget.createBackArrow();
			sideBar2.appendChild(backArrow);

			const ul2 = myWidget.createSecondSidebarList();
			sideBar2.appendChild(ul2);
        },
		createPrjMng: function () {
			const self = this; 
			let sideBar2 = document.querySelector(".second-sidebar");


			if (!sideBar2) {
				sideBar2 = document.createElement("div");
				sideBar2.className = "second-sidebar";
				document.body.appendChild(sideBar2);
			}

			sideBar2.style.display = "block";
			sideBar2.innerHTML = "";
			const scrollableForm = document.createElement("div");
			scrollableForm.className = "scrollable-form";
			
			var contentArea = document.querySelector(".widget-content-area");
            contentArea.innerHTML = "";

			const header = document.createElement("h2");
			header.textContent = "Create TPL";
			header.className = "sidebar-header";

			const titleLabel = document.createElement("label");
			titleLabel.textContent = "Title:";
			titleLabel.className = "form-label";

			const titleInput = document.createElement("input");
			titleInput.type = "text";
			titleInput.placeholder = "Enter Title";
			titleInput.className = "form-input";


			const descLabel = document.createElement("label");
			descLabel.textContent = "Description:";
			descLabel.className = "form-label";

			const descInput = document.createElement("textarea");
			descInput.placeholder = "Enter Description";
			descInput.className = "form-textarea";
			
			const dropZone = document.createElement("div");
			dropZone.className = "drop-zone";
			dropZone.textContent = "Drag & Drop Bookmark here";
			dropZone.style.border = "2px dashed #ccc";
			dropZone.style.padding = "10px";
			dropZone.style.marginBottom = "10px";
			dropZone.style.textAlign = "center";

			let droppedProjectSpace = null;
			let selectedProjectId = null; 
			
			dropZone.addEventListener("dragover", function (e) {
				e.preventDefault();
				dropZone.style.borderColor = "#3D9FE3";
			});

			dropZone.addEventListener("dragleave", function () {
				dropZone.style.borderColor = "#ccc";
			});

			dropZone.addEventListener("drop", function (e) {
				e.preventDefault();
				dropZone.style.borderColor = "#28a745";
				const data = e.dataTransfer.getData("text/plain");
				try {
					const parsed = JSON.parse(data);
					console.log("Drop Parsed ", parsed);
					const dropped = parsed?.data?.items?.[0];  

					if (
						dropped &&
						dropped.objectId &&
						(dropped.displayType === "Project Space" || dropped.objectType === "Project Space")
					) {
						droppedProjectSpace = dropped;
						selectedProjectId = dropped.objectId;
						dropZone.textContent = `Project: ${dropped.displayName || dropped.objectId}`;
					} else {
						dropZone.textContent = "Invalid drop – Not a Project Space.";
					}
				} catch (err) {
					console.error("Drop parsing failed", err);
					dropZone.textContent = "Drop error";
				}
			});
			const buttonContainer = document.createElement("div");
			buttonContainer.className = "btn-center-wrapper";
			
			const createBtn = document.createElement("button");
			createBtn.textContent = "Create TPL";
			createBtn.className = "form-button";
			
			const cancelBtn = document.createElement("button");
			cancelBtn.textContent = "Cancel";
			cancelBtn.className = "cancel-button";
			
			buttonContainer.appendChild(createBtn);
			buttonContainer.appendChild(cancelBtn);
			
			const resultBox = document.createElement("div");
			resultBox.className = "result-box";
			
			const attributeInputs = {};
			const attributeInputs1 = {};
			/*const tplAttributes = [
				{ label: "Product Class", type: "select", options: ["E07", "C56" ,"E46", "S01", "S15", "G12", "E23", "B32", "S09", "S67","B36", "E47"] }
			];*/
			const tplAttributes = [
				{ label: "Product", type: "select", options: ["NSD", "NPD" ,"NotApplicable"] }
			];
			const specAttributes = [
				{ label: "Product Line", type: "select", options: ["Accessories", "ATS" , "EPSAC", "DPSAC", "OFSAC", "MOTOR", "ENGC", "RLY", "CAC"] }
			];
			const attributeContainer = document.createElement("div");
				attributeContainer.className = "attribute-container";

				tplAttributes.forEach(attr => {
				const wrapper = document.createElement("div");
				wrapper.style.marginBottom = "10px";

				const label = document.createElement("label");
				label.className = "form-label";
				label.textContent = attr.label;
				label.style.display = "block";
				label.style.fontWeight = "bold";

				let input;
				if (attr.type === "select") {
					input = document.createElement("select");
					input.className = "form-select";
					attr.options.forEach(optionValue => {
						const option = document.createElement("option");
						option.value = optionValue;
						option.textContent = optionValue;
						input.appendChild(option);
					});
				} else if (attr.type === "textarea") {
					input = document.createElement("textarea");
					input.placeholder = attr.placeholder;
					input.className = "form-textarea";
				} else {
					input = document.createElement("input");
					input.type = attr.type;
					input.placeholder = attr.placeholder;
					input.className = "form-input";
				}

				input.style.width = "100%";
				input.style.padding = "6px";
				input.style.boxSizing = "border-box";
				attributeInputs[attr.label] = input;
				wrapper.appendChild(label);
				wrapper.appendChild(input);
				attributeContainer.appendChild(wrapper);
			});
			const attributeContainer1 = document.createElement("div");
				attributeContainer1.className = "attribute-container";
			let stageWrapper = null;
			specAttributes.forEach(attr => {
				const wrapper = document.createElement("div");
				wrapper.style.marginBottom = "10px";

				const label = document.createElement("label");
				label.className = "form-label";
				label.textContent = attr.label;
				label.style.display = "block";
				label.style.fontWeight = "bold";

				let input;
				if (attr.type === "select") {
					input = document.createElement("select");
					input.className = "form-select";
					attr.options.forEach(optionValue => {
						const option = document.createElement("option");
						option.value = optionValue;
						option.textContent = optionValue;
						input.appendChild(option);
					});
					 input.addEventListener("change", function () {
						const selected = input.value;

						
						if (stageWrapper) {
							stageWrapper.remove();
							stageWrapper = null;
						}

						if (selected === "EPSAC") {
							stageWrapper = document.createElement("div");
							stageWrapper.style.marginBottom = "10px";

							const stageLabel = document.createElement("label");
							stageLabel.className = "form-label";
							stageLabel.textContent = "Stage";
							stageLabel.style.display = "block";
							stageLabel.style.fontWeight = "bold";

							const stageSelect = document.createElement("select");
							stageSelect.className = "form-select";
							stageSelect.style.width = "100%";
							stageSelect.style.padding = "6px";
							stageSelect.style.boxSizing = "border-box";

							["SS", "TS"].forEach(stageValue => {
								const option = document.createElement("option");
								option.value = stageValue;
								option.textContent = stageValue;
								stageSelect.appendChild(option);
							});

							attributeInputs1["Stage"] = stageSelect;

							stageWrapper.appendChild(stageLabel);
							stageWrapper.appendChild(stageSelect);
							attributeContainer1.appendChild(stageWrapper);
						}
					});
				} else if (attr.type === "textarea") {
					input = document.createElement("textarea");
					input.placeholder = attr.placeholder;
					input.className = "form-textarea";
				} else {
					input = document.createElement("input");
					input.type = attr.type;
					input.placeholder = attr.placeholder;
					input.className = "form-input";
				}

				input.style.width = "100%";
				input.style.padding = "6px";
				input.style.boxSizing = "border-box";
				attributeInputs1[attr.label] = input;
				wrapper.appendChild(label);
				wrapper.appendChild(input);
				attributeContainer1.appendChild(wrapper);
			});
			cancelBtn.onclick = () => {
				if (sideBar2) {
					sideBar2.style.display = "none";
				}
			};
			createBtn.onclick = () => {
					const title = titleInput.value.trim();
					const description = descInput.value.trim();

					console.log("title ", title);
					console.log("description ", description);
					console.log("selectedProjectId ", selectedProjectId);

					if (!title) {
						alert("Title and Part Number are required.");
						return;
					}
					if (!selectedProjectId) {
						alert("Please drag and drop a valid Project Space.");
						return;
					}
					const tplAttributeValues = {};
					Object.keys(attributeInputs).forEach(label => {
						tplAttributeValues[label] = attributeInputs[label].value;
					});
					console.log("TPL Attributes:", tplAttributeValues);
					const product = tplAttributeValues["Product"];
					console.log("Product :", product);
					const specAttributeValues = {};
					Object.keys(attributeInputs1).forEach(label => {
						specAttributeValues[label] = attributeInputs1[label].value;
					});
					console.log("SPEC Attributes:", specAttributeValues);
					const productLine = specAttributeValues["Product Line"];
					console.log("Product Line :", productLine);
					
					let stage = specAttributeValues["Stage"]; 
					console.log("Stage:", stage);
					
					const randomNum = Math.floor(1000 + Math.random() * 9000); 
					
					let docNumValue;
					
					if (typeof stage === 'undefined') {
						docNumValue = `${product}-${productLine}-${randomNum}`;
						stage = "";
					} else {
						docNumValue = `${product}-${productLine}${stage ? "-" + stage : ""}-${randomNum}`;
					}
					
					console.log("Doc Value:", docNumValue);
					
					URLS.getURLs().then(baseUrl => {
						console.log("baseUrl:" + baseUrl);
						const csrfURL = baseUrl + '/resources/v1/application/CSRF';

						WAFData.authenticatedRequest(csrfURL, {
							method: 'GET',
							type: 'json',
							onComplete: function (csrfData) {
								console.log("csrfData:" + csrfData);
								const csrfToken = csrfData.csrf.value;
								const csrfHeaderName = csrfData.csrf.name;
								console.log("csrfToken:" + csrfToken);

								const payload = {
									items: [{
										type: "VPMReference",
										attributes: {
											title: title,
											description: description
										}
									}]
								};

								const engURL = baseUrl + '/resources/v1/modeler/dseng/dseng:EngItem';

								WAFData.authenticatedRequest(engURL, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
										'Accept': 'application/json',
										'ENO_CSRF_TOKEN': csrfToken,
										'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
									},
									data: JSON.stringify(payload),
									onComplete: function (response) {
										console.log("response:" + response);
										const result = JSON.parse(response);
										const createdItem = result.member[0];
										const classifyURL = baseUrl + '/resources/v1/modeler/dslib/dslib:CategorizationClassifiedItem';

										const payload = {
										  ClassID: "4111F5970F122000684E60D400002765", 
										  ObjectsToClassify: [
											{
											  source: baseUrl, 
											  type: "dseng:EngItem", 
											  identifier: createdItem.id, 
											  relativePath: "/resources/v1/modeler/dseng/dseng:EngItem/"+createdItem.id
											}
										  ]
										};

										WAFData.authenticatedRequest(classifyURL, {
										  method: 'POST',
										  headers: {
											'Content-Type': 'application/json',
											'Accept': 'application/json',
											'ENO_CSRF_TOKEN': csrfToken,
											'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA' 
										  },
										  data: JSON.stringify(payload),
										  onComplete: function (response) {
											try {
											  const result = JSON.parse(response);
											  console.log("Classification result:", result);
											  
											} catch (e) {
											  console.error("Failed to parse response:", response);
											}
										  },
										  onFailure: function (error) {
											console.error("Classification failed:", error);
										  }
										});
										const createDocURL = baseUrl + '/resources/v1/modeler/documents';
										const createDocPayload = {
											data: [{
												attributes: {
													name: "SpecSheet_" + Date.now(),
													type: "Document",
													policy: "Document Release",
													"extensions": [
														"XP_Document_Ext.DocumentType"
													]
												}
											}]
										};

										WAFData.authenticatedRequest(createDocURL, {
											method: 'POST',
											type: 'json',
											data: JSON.stringify(createDocPayload),
											headers: {
												'Content-Type': 'application/json',
												[csrfHeaderName]: csrfToken,
												'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
											},
											onComplete: function (response) {
												const createdDoc = response.data[0];
												const createdDocId = createdDoc.id;
												console.log("Document created:", createdDocId);

												const updatePayload = {
													data: [{
														id: createdDocId,
														type: "Document",
														updateAction: "MODIFY",
														"dataelements": {
															"title": "SpecSheet_" + Date.now(),
															"DocumentType": "SpecSheet",
															"DocumentNumber": docNumValue
														}
													}]
												};

												const updateDocURL = baseUrl + '/resources/v1/modeler/documents';

												WAFData.authenticatedRequest(updateDocURL, {
													method: 'PUT',
													type: 'json',
													data: JSON.stringify(updatePayload),
													headers: {
														'Content-Type': 'application/json',
														[csrfHeaderName]: csrfToken,
														'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
													},
													onComplete: function (updateResponse) {
														const classifyDocURL = baseUrl + '/resources/v1/modeler/dslib/dslib:CategorizationClassifiedItem';

														const payload1 = {
														  ClassID: "9B402C1B0DB10B00684DC75D00000E6F", 
														  ObjectsToClassify: [
															{
															  source: baseUrl, 
															  type: "Document", 
															  identifier: createdDoc.id, 
															  relativePath: "/resources/v1/modeler/documents/"+createdDocId
															}
														  ]
														};

														WAFData.authenticatedRequest(classifyDocURL, {
														  method: 'POST',
														  headers: {
															'Content-Type': 'application/json',
															'Accept': 'application/json',
															'ENO_CSRF_TOKEN': csrfToken,
															'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA' 
														  },
														  data: JSON.stringify(payload1),
														  onComplete: function (response) {
															try {
															  const result = JSON.parse(response);
															  console.log("Classification result:", result);
															  
															} catch (e) {
															  console.error("Failed to parse response:", response);
															}
														  },
														  onFailure: function (error) {
															console.error("Classification failed:", error);
														  }
														});
														console.log("DocumentType updated successfully", updateResponse);
														const addSpecDocURL = baseUrl + '/resources/v1/modeler/documents/?disableOwnershipInheritance=1&parentRelName=SpecificationDocument&parentDirection=from';

														const payload = {
															csrf: {
																name: csrfHeaderName,
																value: csrfToken
															},
															data: [
																{
																	id: createdDocId,
																	relateddata: {
																		parents: [
																			{
																				id: createdItem.id,
																				updateAction: 'CONNECT'
																			}
																		]
																	},
																	updateAction: 'NONE'
																}
															]
														};

														WAFData.authenticatedRequest(addSpecDocURL, {
															method: 'POST',
															type: 'json',
															headers: {
																'Content-Type': 'application/json',
																[csrfHeaderName]: csrfToken,
																'Accept': 'application/json'
															},
															data: JSON.stringify(payload),
															onComplete: function (res) {
																console.log('Connected Reference Document:', res);
																
															},
															onFailure: function (err) {
																console.error("Failed to connect document:", err);
																alert('Failed to connect Specification document.');
															}
														});
														
														const createSubSheetURL = baseUrl + '/resources/v1/modeler/documents';
														const createSubSheetPayload = {
															data: [{
																attributes: {
																	name: "SubSheet_" + Date.now(),
																	type: "Document",
																	
																	policy: "Document Release",
																	"extensions": [
																		"XP_Document_Ext.DocumentType"
																	]
																}
															}]
														};

														WAFData.authenticatedRequest(createSubSheetURL, {
															method: 'POST',
															type: 'json',
															data: JSON.stringify(createSubSheetPayload),
															headers: {
																'Content-Type': 'application/json',
																[csrfHeaderName]: csrfToken,
																'SecurityContext': 'VPLMProjectLeader.Company Name.Common Space'
															},
															onComplete: function (response) {
																const createdSubDoc = response.data[0];
																const createdSubDocId = createdSubDoc.id;
																console.log("SubSheet Document created:", createdSubDocId);

																const updateSubPayload = {
																	data: [{
																		id: createdSubDocId,
																		type: "Document",
																		updateAction: "MODIFY",
																		"dataelements": {
																			"title": title,
																			"DocumentType": "SubSheet"
																		}
																	}]
																};

																const updateSubSheetURL = baseUrl + '/resources/v1/modeler/documents';

																WAFData.authenticatedRequest(updateSubSheetURL, {
																	method: 'PUT',
																	type: 'json',
																	data: JSON.stringify(updateSubPayload),
																	headers: {
																		'Content-Type': 'application/json',
																		[csrfHeaderName]: csrfToken,
																		'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
																	},
																	onComplete: function (subsheetResponse) {
																		const addAttachedDocURL = baseUrl + '/resources/v1/modeler/documents/?disableOwnershipInheritance=1&parentRelName=Reference Document&parentDirection=from';

																			const payload = {
																				csrf: {
																					name: csrfHeaderName,
																					value: csrfToken
																				},
																				data: [
																					{
																						id: createdSubDocId,
																						relateddata: {
																							parents: [
																								{
																									id: createdDocId,
																									updateAction: 'CONNECT'
																								}
																							]
																						},
																						updateAction: 'NONE'
																					}
																				]
																			};

																			WAFData.authenticatedRequest(addAttachedDocURL, {
																				method: 'POST',
																				type: 'json',
																				headers: {
																					'Content-Type': 'application/json',
																					[csrfHeaderName]: csrfToken,
																					'Accept': 'application/json'
																				},
																				data: JSON.stringify(payload),
																				onComplete: function (res) {
																					console.log('Connected Reference Document:', res);
																					const createCRDURL = baseUrl + '/resources/v1/modeler/documents';
																					const createCRDPayload = {
																						data: [{
																								attributes: {
																									name: "CRD_" + Date.now(),
																									type: "Document",

																									policy: "Document Release",
																									"extensions": [
																										"XP_Document_Ext.DocumentType"
																									]
																								}
																							}
																						]
																					};
																					
																					//alert('Document successfully connected as Reference Document!');
																					WAFData.authenticatedRequest(createCRDURL, {
																							method: 'POST',
																							type: 'json',
																							data: JSON.stringify(createCRDPayload),
																							headers: {
																								'Content-Type': 'application/json',
																								[csrfHeaderName]: csrfToken,
																								'SecurityContext': 'VPLMProjectLeader.Company Name.Common Space'
																							},
																							onComplete: function (response) {
																								const createdCRDDoc = response.data[0];
																								const createdCRDDocId = createdCRDDoc.id;
																								console.log("CRD Document created:", createdCRDDocId);

																								const updateSubPayload = {
																									data: [{
																											id: createdCRDDocId,
																											type: "Document",
																											updateAction: "MODIFY",
																											"dataelements": {
																												"title": title,
																												"DocumentType": "CRD"
																											}
																										}
																									]
																								};
																								const updateCRDURL = baseUrl + '/resources/v1/modeler/documents';

																								WAFData.authenticatedRequest(updateCRDURL, {
																									method: 'PUT',
																									type: 'json',
																									data: JSON.stringify(updateSubPayload),
																									headers: {
																										'Content-Type': 'application/json',
																										[csrfHeaderName]: csrfToken,
																										'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
																									},
																									onComplete: function (response) {
																									const addAttachedCRDSpecURL = baseUrl + '/resources/v1/modeler/documents/?disableOwnershipInheritance=1&parentRelName=Reference Document&parentDirection=from';

																									const payload = {
																										csrf: {
																											name: csrfHeaderName,
																											value: csrfToken
																										},
																										data: [
																											{
																												id: createdDocId,
																												relateddata: {
																													parents: [
																														{
																															id: createdCRDDocId,
																															updateAction: 'CONNECT'
																														}
																													]
																												},
																												updateAction: 'NONE'
																											}
																										]
																									};

																									WAFData.authenticatedRequest(addAttachedCRDSpecURL, {
																										method: 'POST',
																										type: 'json',
																										headers: {
																											'Content-Type': 'application/json',
																											[csrfHeaderName]: csrfToken,
																											'Accept': 'application/json'
																										},
																										data: JSON.stringify(payload),
																										onComplete: function (createResponse) {
																											console.log("createResponse :" + createResponse);

																										},
																										onFailure: function (err) {
																											console.error(" error:", err);
																										}
																										
																									});
																										const addAttachedCRDURL = baseUrl + '/resources/v1/modeler/documents/?disableOwnershipInheritance=1&parentRelName=Reference Document&parentDirection=from';

																										const CRDpayload = {
																											csrf: {
																												name: csrfHeaderName,
																												value: csrfToken
																											},
																											data: [{
																													id: createdCRDDocId,
																													relateddata: {
																														parents: [{
																																id: createdItem.id,
																																updateAction: 'CONNECT'
																															}
																														]
																													},
																													updateAction: 'NONE'
																												}
																											]
																										};
																										WAFData.authenticatedRequest(addAttachedCRDURL, {
																											method: 'POST',
																											type: 'json',
																											headers: {
																												'Content-Type': 'application/json',
																												[csrfHeaderName]: csrfToken,
																												'Accept': 'application/json'
																											},
																											data: JSON.stringify(CRDpayload),
																											onComplete: function (res) {
																												const getFolderURL = baseUrl + '/resources/v1/modeler/projects/' + selectedProjectId + '/folders';

																												WAFData.authenticatedRequest(getFolderURL, {
																												  method: 'GET',
																												  headers: {
																													'Accept': 'application/json',
																													'ENO_CSRF_TOKEN': csrfToken,
																													'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
																												  },
																												  onComplete: function (response) {
																													   try {
																															let json;

																															if (response && response.success && Array.isArray(response.data)) {
																																json = response;
																															}
																															else if (response && response.responseText) {
																																json = JSON.parse(response.responseText);
																															} else if (typeof response === "string") {
																																json = JSON.parse(response);
																															} else {
																																throw new Error("Unknown response format");
																															}
																															const CRDFolder = json.data.find(item =>
																															item.dataelements &&
																															item.dataelements.title &&
																															item.dataelements.title.toLowerCase().includes("crd"));
																															
																															if (CRDFolder) {
																																console.log("CRD Folder ID:", CRDFolder.id);
																																const bookMarkURL = baseUrl + '/resources/v1/FolderManagement/Folder/' + CRDFolder.id + '/content';
																																WAFData.authenticatedRequest(bookMarkURL, {
																																	method: 'POST',
																																	type: 'json',
																																	headers: {
																																		'Content-Type': 'application/json',
																																		'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
																																		[csrfHeaderName]: csrfToken
																																	},
																																	data: JSON.stringify({
																																		"IDs": createdCRDDocId
																																	}),
																																	onComplete: function (createResponse) {
																																		console.log("createResponse :" + createResponse);

																																	},
																																	onFailure: function (err) {
																																		console.error(" error:", err);
																																	}
																																});
																															}else {
																																alert("No folder with title 'CRD' found.");
																															}
																															const specFolder = json.data.find(item =>
																																item.dataelements &&
																																item.dataelements.title &&
																																item.dataelements.title.toLowerCase().includes("specification")
																															);

																															if (specFolder) {
																																console.log("Specification Folder ID:", specFolder.id);
																																const folderTreeURL = baseUrl + '/resources/v1/FolderManagement/Folder/' + specFolder.id + '/folderTree';
																																WAFData.authenticatedRequest(folderTreeURL, {
																																	method: 'POST',
																																	type: 'json',
																																	data: JSON.stringify({
																																		expandList: "",
																																		isRoot: "",
																																		nextStart: 0,
																																		nresults: 200,
																																		Read: true,
																																		refine: "",
																																		sortMode: "ds6w:label",
																																		sortOrder: "asc"
																																	}),
																																	headers: {
																																		'Content-Type': 'application/json',
																																		'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
																																		[csrfHeaderName]: csrfToken
																																	}, 
																																	onComplete: function (response) {
																																		console.log("response:", response);
																																		const specsheet = response.folders.find(folder => 
																																		  /specsheet/i.test(folder.label)
																																		);
																																		console.log("specsheet:"+specsheet);
																																		const subsheet = response.folders.find(folder => 
																																		  /subsheet/i.test(folder.label)
																																		);
																																		console.log("subsheet:"+subsheet);
																																		if (specsheet) {
																																		  const specsheetId = specsheet.id;
																																		  const bookMarkURL = baseUrl + '/resources/v1/FolderManagement/Folder/'+ specsheet.id +'/content';
																																			WAFData.authenticatedRequest(bookMarkURL, {
																																				method: 'POST',
																																				type: 'json',
																																				headers: {
																																					'Content-Type': 'application/json',
																																					'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
																																					[csrfHeaderName]: csrfToken
																																				},
																																				data: JSON.stringify({"IDs": createdDocId}),
																																				onComplete: function (createResponse) {
																																					console.log("createResponse :"+createResponse);
												
																																				},
																																				onFailure: function (err) {
																																					console.error(" error:", err);
																																				}
																																			}); 
																																		} else {
																																			
																																		  console.warn("Specsheet folder not found.");
																																		} 
																																		if (subsheet) {
																																		  const subsheetId = subsheet.id;
																																		  const bookMarkURL = baseUrl + '/resources/v1/FolderManagement/Folder/'+ subsheet.id +'/content';
																																			WAFData.authenticatedRequest(bookMarkURL, {
																																				method: 'POST',
																																				type: 'json',
																																				headers: {
																																					'Content-Type': 'application/json',
																																					'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
																																					[csrfHeaderName]: csrfToken
																																				},
																																				data: JSON.stringify({"IDs": createdSubDocId}),
																																				onComplete: function (createResponse) {
																																					console.log("createResponse :"+createResponse);
												
												const getURL = baseUrl + '/resources/v1/modeler/dslib/dslib:ClassifiedItem/' + createdItem.id + '?$mask=dslib:ClassificationAttributesMask';

												WAFData.authenticatedRequest(getURL, {
												  method: 'GET',
												  headers: {
													'Accept': 'application/json',
													'ENO_CSRF_TOKEN': csrfToken,
													'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
												  },
												  onComplete: function (data) {
													const result = JSON.parse(data);
													const item = result.member[0]; 
													const cestamp = item.cestamp;
													console.log("result:", result);
													console.log("Current cestamp:", cestamp);
													console.log("Current attributes:", item.attributes);
													const classId = item.ClassificationAttributes.member[0].ClassID; 
													console.log("classId:", classId);
													const isClassified = 
													  item.ClassificationAttributes &&
													  Array.isArray(item.ClassificationAttributes.member) &&
													  item.ClassificationAttributes.member.length > 0;
													console.log("isClassified:", isClassified);
													const tenant = widget.getValue("x3dPlatformId");
													const updateURL = baseUrl + '/resources/IPClassificationReuse/classifiedItem/attributes/update?tenant='+ tenant;
													
													const updatePayload = {
													  requests: [
														{
														  body: [
															{
															  facet: classId,  
															  op: "replace",
															  path: "ProductLines",    
															  value: productLine       
															},
															{
															  facet: classId,
															  op: "replace",
															  path: "ELGIProduct",
															  value: product
															},
															{
															  facet: classId,
															  op: "replace",
															  path: "Stage",
															  value: stage
															}
															
														  ],
														  classId: classId,
														  classUsage: "Standard",
														  method: "POST",
														  path: `model/bus/${createdItem.id}`, 
														  queryParams: {
															select: ["physicalid", "modified", "attribute[ProductLines]", "attribute[ELGIProduct]"]
														  }
														}
													  ]
													};
													WAFData.authenticatedRequest(updateURL, {
													  method: 'POST',
													  headers: {
														'Content-Type': 'application/json',
														'Accept': 'application/json',
														'ENO_CSRF_TOKEN': csrfToken,
														'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
													  },
													  data: JSON.stringify(updatePayload),
													  onComplete: function (resp) {
														console.log("POST success:", resp);
														const getURL = baseUrl + '/resources/v1/modeler/dslib/dslib:ClassifiedItem/' + createdDocId + '?$mask=dslib:ClassificationAttributesMask';

												WAFData.authenticatedRequest(getURL, {
												  method: 'GET',
												  headers: {
													'Accept': 'application/json',
													'ENO_CSRF_TOKEN': csrfToken,
													'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
												  },
												  onComplete: function (data) {
													const result = JSON.parse(data);
													const item = result.member[0]; 
													const cestamp = item.cestamp;
													console.log("result:", result);
													console.log("Current cestamp:", cestamp);
													console.log("Current attributes:", item.attributes);
													const specclassId = item.ClassificationAttributes.member[0].ClassID; 
													console.log("specclassId:", specclassId);
													
													const updateURL = baseUrl + '/resources/IPClassificationReuse/classifiedItem/attributes/update?tenant='+ tenant;
													const updatePayload = {
													  requests: [
														{
														  body: [
															{
															  facet: specclassId,  
															  op: "replace",
															  path: "ProductLines",    
															  value: productLine       
															},
															{
															  facet: specclassId,
															  op: "replace",
															  path: "ELGIProduct",
															  value: product
															}
														  ],
														  classId: specclassId,
														  classUsage: "Standard",
														  method: "POST",
														  path: `model/bus/${createdDocId}`, 
														  queryParams: {
															select: ["physicalid", "modified", "attribute[ProductLines]", "attribute[ELGIProduct]"]
														  }
														}
													  ]
													};

													WAFData.authenticatedRequest(updateURL, {
													  method: 'POST',
													  headers: {
														'Content-Type': 'application/json',
														'Accept': 'application/json',
														'ENO_CSRF_TOKEN': csrfToken,
														'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA'
													  },
													  data: JSON.stringify(updatePayload),
													  onComplete: function (resp) {
														console.log("POST success:", resp);
														
														  document.querySelectorAll('.form-input').forEach(input => input.value = '');

														  document.querySelectorAll('.form-textarea').forEach(textarea => textarea.value = '');

													
														  document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

														  const dropZone = document.getElementById('dropZone');
														  if (dropZone) {
															dropZone.innerHTML = 'Drop files here'; 
														  }
														alert("TPL Created Successfully: " + createdItem.name);
													  },
													  onFailure: function (err) {
														console.error("PATCH failed:", err);
													  }
													});

												  },
												  onFailure: function (error) {
													console.error("GET classified item failed:", error);
												  }
												});
														
													  },
													  onFailure: function (err) {
														console.error("PATCH failed:", err);
													  }
													});

												  },
												  onFailure: function (error) {
													console.error("GET classified item failed:", error);
												  }
												});	
																																				},
																																				onFailure: function (err) {
																																					console.error(" error:", err);
																																				}
																																			}); 
																																		} else {
																																			
																																		  console.warn("Controlled Copy folder not found.");
																																		} 
																																	},
																																	onFailure: function (err) {
																																		console.error(" error:", err);
																																	}
																																});
																															} else {
																																alert("No folder with title 'Specification' found.");
																															}

																														} catch (e) {
																															console.error("Parsing error:", e);
																															alert("Invalid response format or data.");
												
																														}
																													  
																												  },
																												  onFailure: function (err) {
																													console.error("PATCH failed:", err);
																												  }
																												});
																											},
																											onFailure: function (err) {
																												console.error("Failed to Connecr CRD:", err);
																											}
																											
																										});
																									},
																									onFailure: function (err) {
																										console.error("Failed to update CRD DocumentType:", err);
																									}
                                                                                                });
																							},
																							onFailure: function (err) {
																								console.error("Failed to create CRD Document:", err);
																							}
																					});
																				},
																				onFailure: function (err) {
																					console.error("Failed to connect document:", err);
																					alert('Failed to connect reference document.');
																				}
																			});
																		console.log("SubSheet DocumentType updated successfully", subsheetResponse);
																	},
																	onFailure: function (err) {
																		console.error("Failed to update SubSheet DocumentType:", err);
																	}
																});
															},
															onFailure: function (err) {
																console.error("Failed to create SubSheet Document:", err);
															}
														});
													},
													onFailure: function (err) {
														console.error("Failed to update SpecSheet DocumentType:", err);
													}
												});

												const attachURL = baseUrl + '/resources/v1/modeler/projects';
												const attachDocPayload = {
												  data: [{
													id: selectedProjectId,
													type: "Project Space",
													updateAction: "MODIFY",
													relateddata: {
													  references: [{
														id: createdItem.id,         
														type: "VPMReference",
														updateAction: "CONNECT"
													  }]
													}
												  }]
												};

												WAFData.authenticatedRequest(attachURL, {
													method: 'PUT',
													type: 'json',
													headers: {
														'Content-Type': 'application/json',
														'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
														[csrfHeaderName]: csrfToken
													},
													data: JSON.stringify(attachDocPayload),
													onComplete: function (createResponse) {
														console.log("createResponse :", createResponse);
														
														
														
														
													},
													onFailure: function (err) {
														console.error("Failed to check in the document: ", err);
													}
												});
											},
											onFailure: function (err) {
												console.error("Failed to create SpecSheet Document:", err);
											}
										});
												
									},
									onFailure: function (error) {
										console.error("Failed to create Engineering Item", error);
										alert("Error creating Engineering Item.");
									}
								});
							},
							onFailure: function (err) {
								console.error("Failed to fetch CSRF token", err);
							}
						});
					});
				};

			const formWrapper = document.createElement("div");
			formWrapper.className = "scrollable-form";

			const section1 = document.createElement("div");
			section1.className = "form-section";
			section1.appendChild(titleLabel);
			section1.appendChild(titleInput);
			section1.appendChild(descLabel);
			section1.appendChild(descInput);
			section1.appendChild(dropZone);

			const section2 = document.createElement("div");
			section2.className = "form-section";
			section2.appendChild(attributeContainer);

			const section3 = document.createElement("div");
			section3.className = "form-section";
			section3.appendChild(attributeContainer1);

			const section4 = document.createElement("div");
			section4.className = "form-section";
			section4.appendChild(buttonContainer);
			//section4.appendChild(cancelBtn);
			section4.appendChild(resultBox);

			formWrapper.appendChild(header);
			formWrapper.appendChild(section1);
			formWrapper.appendChild(section2);
			formWrapper.appendChild(section3);
			formWrapper.appendChild(section4);
			//sideBar2.appendChild(header);
			//sideBar2.appendChild(titleLabel);
			//sideBar2.appendChild(titleInput);

			//sideBar2.appendChild(descLabel);
			//sideBar2.appendChild(descInput);
			//sideBar2.appendChild(dropZone);
			//sideBar2.appendChild(attributeContainer);
			//sideBar2.appendChild(attributeContainer1);
			//sideBar2.appendChild(createBtn);
			//sideBar2.appendChild(resultBox);
			sideBar2.appendChild(formWrapper);
			//sideBar2.appendChild(scrollableForm);
		},
		
		toggleSecondSidebar: function (visible) {
            var sideBar2 = document.querySelector(".second-sidebar");
            sideBar2.style.display = visible ? "block" : "none";
        },
		showCtrlCopyButtons: function () {
            myWidget.createMainSkeleton("Generate Controlled Copy (PDF)", myWidget.setBtnCtrlCopy);
        },
		setBtnCtrlCopy: function () {

            return myWidget.paramCtrlCopyDiv(myWidget.EPRCompFun);

        },
		paramCtrlCopyDiv: function (btnonclickFun) {
            const div1 = this.createDiv("scroller scroller-root", "parametersDiv");
            const div2 = this.createDiv("no-native-scrollbars scroller-content");
            const div3 = this.createDiv("divided filled accordion accordion-root");
            div3.appendChild(myWidget.parmERPDownloadcontent("file-type-excel.svg", btnonclickFun));
            div2.appendChild(div3);
            div1.appendChild(div2);

            return div1;
        },
		/*EPRCompFun: async function () {
			try {
				console.log("Download button clicked");
				const chips = document.querySelectorAll('.YATG_wux-controls-selectionChips .YATG_wux-chip-cell-label');
				const selectedIds = Array.from(chips).map(chip => chip.id);

				if (selectedIds.length !== 2) {
					alert("Please drop only two documents.");
					return;
				}

				const allBookmarks = [];

				for (const id of selectedIds) {
					console.log("Fetching bookmarks for document ID:", id);
					const bookmarks = await myWidget.fetchBookmarksForDocument(id);
					console.log("Bookmarks for", id, ":", bookmarks);
					allBookmarks.push({ id, bookmarks });
				}

				console.log("All fetched bookmarks:", allBookmarks);
				
				const allCtrlCpy = [];
				for (const entry of allBookmarks) {
					for (const bookmark of entry.bookmarks) {
						const bookmarkId = bookmark.id;
						console.log("Fetching Ctrl Copy for Bookmark ID:", bookmarkId);
						const ctrlCopyId = await myWidget.getParentRelatedCtrlCopy(bookmarkId);
						console.log("Ctrl Copy for", bookmarkId, ":", ctrlCopyId);
						allCtrlCpy.push({ bookmarkId, ctrlCopyId });
					}
				}
				console.log("All fetched CtrlCopy:", allCtrlCpy);
				// Proceed with merging and PDF generation if needed
				const doc1 = await myWidget.fetchDocumentData(selectedIds[0]);
				const doc2 = await myWidget.fetchDocumentData(selectedIds[1]);				  
				const mergedContent = myWidget.mergeDocumentsIntoTable(doc1, doc2);
				const pdfData = await myWidget.generatePDF(mergedContent);
				await myWidget.createDocumentWithPDF(pdfData,allCtrlCpy);
				alert("Document created and checked in successfully!");
				document.querySelectorAll('.YATG_wux-chip-cell-container').forEach(el => el.remove());
			} catch (error) {
				console.error(error);
				if (typeof popup !== 'undefined') popup.style.display = "none";
			}
		},*/
		EPRCompFun: async function () {
			try {
				const specChips = document.querySelectorAll('#specsheetDrop .YATG_wux-chip-cell-label');
				const tplChips = document.querySelectorAll('#tplDrop .YATG_wux-chip-cell-label');

				if (specChips.length !== 1) {
					alert("Please drop exactly one Spec Sheet document.");
					return;
				}
				if (tplChips.length === 0 || tplChips.length > 3) {
					alert("Please drop between 1 to 3 TPL documents.");
					return;
				}

				const specId = specChips[0].id;
				const tplIds = Array.from(tplChips).map(c => c.id);
				console.log("Spec:", specId);
				console.log("TPLs:", tplIds);

				

				/*const allBookmarks = [];

				for (const id of [specId, ...tplIds]) {
					console.log("Fetching bookmarks for document ID:", id);
					const bookmarks = await myWidget.fetchBookmarksForDocument(id);
					allBookmarks.push({ id, bookmarks });
				}

				const allCtrlCpy = [];
				for (const entry of allBookmarks) {
					for (const bookmark of entry.bookmarks) {
						const ctrlCopyId = await myWidget.getParentRelatedCtrlCopy(bookmark.id);
						allCtrlCpy.push({ bookmarkId: bookmark.id, ctrlCopyId });
					}
				}*/

				const doc1 = await myWidget.fetchDocumentData(specId);
				const tplDocs = await Promise.all(tplIds.map(id => myWidget.fetchTPLDocumentData(id)));
				const mergedContent = myWidget.mergeDocumentsIntoTable(tplDocs);
				const pdfData = await myWidget.generatePDF(mergedContent);

				await myWidget.checkinPDF(pdfData, specId);
				alert("PDF generated checked in successfully!");
				document.querySelectorAll('.YATG_wux-chip-cell-container').forEach(el => el.remove());
			} catch (error) {
				console.error(error);
				if (typeof popup !== 'undefined') popup.style.display = "none";
			}
		},
		fetchDocumentData: function (docId) {
				return new Promise(function (resolve, reject) {
					URLS.getURLs().then(baseUrl => {
					console.log("baseUrl:" + baseUrl);

							const csrfURL = baseUrl + '/resources/v1/application/CSRF';

							WAFData.authenticatedRequest(csrfURL, {
								method: 'GET',
								type: 'json',
								onComplete: function (csrfData) {
									const csrfToken = csrfData.csrf.value;
									const csrfHeaderName = csrfData.csrf.name;

									const docURL = baseUrl + '/resources/v1/modeler/documents/' + docId;
									WAFData.authenticatedRequest(docURL, {
										method: 'GET',
										type: 'json',
										headers: {
											'Content-Type': 'application/json',
											[csrfHeaderName]: csrfToken
										},
										onComplete: function (docData) {
										console.log("Fetched docData for ID", docId, docData);
											if (docData.data && docData.data.length > 0) {
												resolve(docData.data[0]);  
											} else {
												reject("No document data returned");
											}
										},
										onFailure: function (err) {
											reject(err);
										}
									});
								},
								onFailure: function (err) {
									reject(err);
								}
							});
					});
				});
			},
		fetchTPLDocumentData: function (docId) {
				return new Promise(function (resolve, reject) {
					URLS.getURLs().then(baseUrl => {
					console.log("baseUrl:" + baseUrl);

							const csrfURL = baseUrl + '/resources/v1/application/CSRF';

							WAFData.authenticatedRequest(csrfURL, {
								method: 'GET',
								type: 'json',
								onComplete: function (csrfData) {
									const csrfToken = csrfData.csrf.value;
									const csrfHeaderName = csrfData.csrf.name;

									const docURL = baseUrl + '/resources/v1/modeler/documents/parentId/' + docId + '?parentRelName=SpecificationDocument&$include=all&parentDirection=from';
									WAFData.authenticatedRequest(docURL, {
										method: 'GET',
										type: 'json',
										headers: {
											'Content-Type': 'application/json',
											[csrfHeaderName]: csrfToken
										},
										onComplete: function (docData) {
										console.log("Fetched docData for ID", docId, docData);
											if (docData.data && docData.data.length > 0) {
												
												  const specId = docData.data[0].id;
												  console.log("specId", specId);
												const createDocURL = baseUrl + '/resources/v1/modeler/documents/parentId/'+specId+'?parentRelName=Reference Document&parentDirection=from&$fields=indexedImage,indexedTypeicon,isDocumentType,organizationTitle,isLatestRevision,!parentId';

													WAFData.authenticatedRequest(createDocURL, {
														method: 'GET',
														type: 'json',
														headers: {
															'Content-Type': 'application/json',
															[csrfHeaderName]: csrfToken
														},
														onComplete: function (response) {
															 if (response && response.data && response.data.length > 0) {
																const documentList = response.data || [];
																let allFileIds = [];

																documentList.forEach(doc => {
																	const docId = doc.id || 'N/A';
																	const docName = doc.dataelements?.name || 'N/A';

																	allFileIds.push({
																		id: docId,
																		name: docName
																	});
																});

																alert(`Document List: ${JSON.stringify(allFileIds, null, 2)}`);
																resolve(documentList[0]);
															} else {
																console.warn('No document found');
																alert("No document data found.");
															}
														},
														onFailure: function (err) {
															console.error("Failed to get attachments:", err);
															alert("Failed to get attachments.");
														}
													});
														} else {
															reject("No document data returned");
														}
													},
													onFailure: function (err) {
														reject(err);
													}
									});
								},
								onFailure: function (err) {
									reject(err);
								}
							});
					});
				});
			},
		mergeDocumentsIntoTable: function(docs) {
			const headers = ["Name", "Policy", "State", "Document Type", "Originated"];
			const rows = docs.map(doc => [
				doc.dataelements?.name || 'N/A',
				doc.dataelements?.policy || 'N/A',
				doc.dataelements?.state || 'N/A',
				doc.dataelements?.DocumentType || 'N/A',
				doc.dataelements?.originated || 'N/A'
			]);

			return { headers, rows };
		},
		generatePDF: async function (content) {
			const jsPDF = jspdfModule.default;
			
			 if (typeof jsPDF === 'function' && typeof jsPDF.API.autoTable === 'undefined') {
				autotablePlugin(jsPDF);
			}
			 console.log("jsPDF",jsPDF);
			try {
				if (!content.headers || !content.rows || !Array.isArray(content.headers) || !Array.isArray(content.rows)) {
					throw new Error('Invalid content format. Expected object with "headers" and "rows" arrays.');
				}

				const doc = new jsPDF();
				if (typeof doc.autoTable !== 'function') {
					throw new Error("AutoTable plugin is not available.");
				}

				doc.autoTable({
					head: [content.headers],
					body: content.rows
				});

				return doc.output('blob');
			} catch (err) {
				console.error('Failed to generate PDF:', err);
				throw err;
			}
		},
		checkinPDF: function(pdfBlob,docId) {
			return new Promise(function (resolve, reject) {
				
				URLS.getURLs().then(baseUrl => {
					console.log("baseUrl:" + baseUrl);
						const csrfURL = baseUrl + '/resources/v1/application/CSRF';

						// 1. Fetch CSRF token
						WAFData.authenticatedRequest(csrfURL, {
							method: 'GET',
							type: 'json',
							onComplete: function (csrfData) {
								const csrfToken = csrfData.csrf.value;
								const csrfHeaderName = csrfData.csrf.name;

								
										
										// 3. Request Checkin Ticket
										const ticketURL = baseUrl + '/resources/v1/modeler/documents/' + docId + '/files/CheckinTicket';
										const ticketPayload = {
											data: [{
												id: docId,
												dataelements: {
													format: "pdf",
													title: "MergedPDF",
													fileName: "Merged_Document.pdf"
												}
											}]
										};

										WAFData.authenticatedRequest(ticketURL, {
											method: 'PUT',
											type: 'json',
											headers: {
												'Content-Type': 'application/json',
												[csrfHeaderName]: csrfToken
											},
											data: JSON.stringify(ticketPayload),
											onComplete: function (ticketResponse) {
												console.log("ticketResponse:", ticketResponse);
												const ticketInfo = ticketResponse.data[0].dataelements;
												console.log("ticketInfo:", ticketInfo);
												const paramName = ticketInfo.ticketparamname;
												const ticket = ticketInfo.ticket;
												const fcsUrl = ticketInfo.ticketURL;

												console.log("Using ticket param:", paramName);
												console.log("Ticket:", ticket);
												console.log("FCS Upload URL:", fcsUrl);
												console.log("PDF Blob size:", pdfBlob.size);
												const formData = new FormData();
												formData.append(paramName, ticket);
												formData.append('file_0', pdfBlob, "Merged_Document.pdf");
												
												

												const xhr = new XMLHttpRequest();
												xhr.open('POST', fcsUrl, true);
												console.log("xhr.status:", xhr.status);
												//xhr.setRequestHeader(csrfHeaderName, csrfToken); 
												xhr.onload = function () {
													if (xhr.status === 200) {
														// 5. Call Checkin
														console.log("Raw FCS responseText:", xhr.responseText);
														
														const receipt = xhr.responseText;

														if (!receipt) {
															reject("FCS upload succeeded but no valid receipt was returned.");
															return;
														}
														console.log("Receipt:", receipt);
														
														const checkInURL = baseUrl + '/resources/v1/modeler/documents' ;
														console.log("Checkin URL:", checkInURL);
														console.log("Document ID:", docId);
														const checkInPayload = {
														  data: [{
															"id": docId,
															"relateddata": {
																			"files": [
																				{
																					"dataelements": {
																						"comments": "COMING VIA EXTERNAL WIDGET",
																						"receipt": receipt,
																						"title": "Merged_Document"
																					},
																					"updateAction": "CREATE"
																				}
																			]
																		},
																		"updateAction": "NONE"
																	}
																]
														};

														WAFData.authenticatedRequest(checkInURL, {
															method: 'PUT',
															type: 'json',
															headers: {
																'Content-Type': 'application/json',
																'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
																[csrfHeaderName]: csrfToken
															},
															data: JSON.stringify(checkInPayload),
															onComplete: function (createResponse) {
																console.log("createResponse :"+createResponse);
																resolve(createResponse);
																
															},
															onFailure: function (err) {
																reject("Failed to check in the document: " + err);
															}
														});
													} else {
														reject("Failed to upload PDF to FCS. Status: " + xhr.status);
													}
												};
												xhr.onerror = function () {
													reject("FCS upload request failed.");
												};
												xhr.send(formData);
											},
											onFailure: function (err) {
												reject("Failed to get checkin ticket: " + err);
											}
										});
							},
							onFailure: function (err) {
								reject("Failed to get CSRF token: " + err);
							}
						});
				});
			});
		},
		createDocumentWithPDF: function(pdfBlob,allCtrlCpy) {
			return new Promise(function (resolve, reject) {
				
				URLS.getURLs().then(baseUrl => {
					console.log("baseUrl:" + baseUrl);
						const csrfURL = baseUrl + '/resources/v1/application/CSRF';

						// 1. Fetch CSRF token
						WAFData.authenticatedRequest(csrfURL, {
							method: 'GET',
							type: 'json',
							onComplete: function (csrfData) {
								const csrfToken = csrfData.csrf.value;
								const csrfHeaderName = csrfData.csrf.name;

								// 2. Create Document metadata
								const createDocURL = baseUrl + '/resources/v1/modeler/documents';
								const payload = {
									data: [{
										attributes: {
											name: "Merged_Document_" + Date.now(),
											type: "Document",
											policy: "Document Release"
										}
									}]
								};

								WAFData.authenticatedRequest(createDocURL, {
									method: 'POST',
									type: 'json',
									headers: {
										'Content-Type': 'application/json',
										[csrfHeaderName]: csrfToken
									},
									data: JSON.stringify(payload),
									onComplete: function (createResponse) {
										const docId = createResponse.data[0].id;
										
										// 3. Request Checkin Ticket
										const ticketURL = baseUrl + '/resources/v1/modeler/documents/' + docId + '/files/CheckinTicket';
										const ticketPayload = {
											data: [{
												id: docId,
												dataelements: {
													format: "pdf",
													title: "MergedPDF",
													fileName: "Merged_Document.pdf"
												}
											}]
										};

										WAFData.authenticatedRequest(ticketURL, {
											method: 'PUT',
											type: 'json',
											headers: {
												'Content-Type': 'application/json',
												[csrfHeaderName]: csrfToken
											},
											data: JSON.stringify(ticketPayload),
											onComplete: function (ticketResponse) {
												console.log("ticketResponse:", ticketResponse);
												const ticketInfo = ticketResponse.data[0].dataelements;
												console.log("ticketInfo:", ticketInfo);
												const paramName = ticketInfo.ticketparamname;
												const ticket = ticketInfo.ticket;
												const fcsUrl = ticketInfo.ticketURL;

												console.log("Using ticket param:", paramName);
												console.log("Ticket:", ticket);
												console.log("FCS Upload URL:", fcsUrl);
												console.log("PDF Blob size:", pdfBlob.size);
												const formData = new FormData();
												formData.append(paramName, ticket);
												formData.append('file_0', pdfBlob, "Merged_Document.pdf");
												
												

												const xhr = new XMLHttpRequest();
												xhr.open('POST', fcsUrl, true);
												console.log("xhr.status:", xhr.status);
												//xhr.setRequestHeader(csrfHeaderName, csrfToken); 
												xhr.onload = function () {
													if (xhr.status === 200) {
														// 5. Call Checkin
														console.log("Raw FCS responseText:", xhr.responseText);
														
														const receipt = xhr.responseText;

														if (!receipt) {
															reject("FCS upload succeeded but no valid receipt was returned.");
															return;
														}
														console.log("Receipt:", receipt);
														
														const checkInURL = baseUrl + '/resources/v1/modeler/documents' ;
														console.log("Checkin URL:", checkInURL);
														console.log("Document ID:", docId);
														const checkInPayload = {
														  data: [{
															"id": docId,
															"relateddata": {
																			"files": [
																				{
																					"dataelements": {
																						"comments": "COMING VIA EXTERNAM WIDGET",
																						"receipt": receipt,
																						"title": "Merged_Document"
																					},
																					"updateAction": "CREATE"
																				}
																			]
																		},
																		"updateAction": "NONE"
																	}
																]
														};

														WAFData.authenticatedRequest(checkInURL, {
															method: 'PUT',
															type: 'json',
															headers: {
																'Content-Type': 'application/json',
																'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
																[csrfHeaderName]: csrfToken
															},
															data: JSON.stringify(checkInPayload),
															onComplete: function () {
																const firstCtrlCopy = allCtrlCpy[0]?.ctrlCopyId;
																if (!firstCtrlCopy) {
																	reject("No CtrlCopy ID found to add document to.");
																	return;
																}
																const bookMarkURL = baseUrl + '/resources/v1/FolderManagement/Folder/'+ firstCtrlCopy +'/content';
																WAFData.authenticatedRequest(bookMarkURL, {
																	method: 'POST',
																	type: 'json',
																	headers: {
																		'Content-Type': 'application/json',
																		'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
																		[csrfHeaderName]: csrfToken
																	},
																	data: JSON.stringify({"IDs": docId}),
																	onComplete: function (createResponse) {
																		console.log("createResponse :"+createResponse);
																		resolve(createResponse);
																	},
																	onFailure: function (err) {
																		reject("Failed to add bookmark: " + err);
																	}
																});
															},
															onFailure: function (err) {
																reject("Failed to check in the document: " + err);
															}
														});
													} else {
														reject("Failed to upload PDF to FCS. Status: " + xhr.status);
													}
												};
												xhr.onerror = function () {
													reject("FCS upload request failed.");
												};
												xhr.send(formData);
											},
											onFailure: function (err) {
												reject("Failed to get checkin ticket: " + err);
											}
										});
									},
									onFailure: function (err) {
										reject("Failed to create document: " + err);
									}
								});
							},
							onFailure: function (err) {
								reject("Failed to get CSRF token: " + err);
							}
						});
				});
			});
		},
		getParentRelatedCtrlCopy: function (bookmarkId) {
			return new Promise((resolve, reject) => {
				URLS.getURLs().then(baseUrl => {
					console.log("baseUrl:" + baseUrl);

					const csrfURL = baseUrl + '/resources/v1/application/CSRF';

					WAFData.authenticatedRequest(csrfURL, {
						method: 'GET',
						type: 'json',
						onComplete: function (csrfData) {
							const csrfToken = csrfData.csrf.value;
							const csrfHeaderName = csrfData.csrf.name;

							const ecosystemURL = baseUrl + '/resources/v1/modeler/dsbks/dsbks:Bookmark/' + bookmarkId + '?$mask=dsbks:BksMask.Parent';

							WAFData.authenticatedRequest(ecosystemURL, {
								method: 'GET',
								type: 'json',
								headers: {
									'Content-Type': 'application/json',
									'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
									[csrfHeaderName]: csrfToken
								},
								onComplete: function (response) {
									console.log("getEcosystem result:", response);
									try {
										const parentId = response?.member?.[0]?.parent?.member?.[0]?.referencedObject?.identifier;
										if (parentId) {
											const folderTreeURL = baseUrl + '/resources/v1/FolderManagement/Folder/' + parentId + '/folderTree';
											WAFData.authenticatedRequest(folderTreeURL, {
												method: 'POST',
												type: 'json',
												data: JSON.stringify({
													expandList: "",
													isRoot: "",
													nextStart: 0,
													nresults: 200,
													Read: true,
													refine: "",
													sortMode: "ds6w:label",
													sortOrder: "asc"
												}),
												headers: {
													'Content-Type': 'application/json',
													'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
													[csrfHeaderName]: csrfToken
												},
												onComplete: function (response) {
													const controlledCopyFolder = response.folders.find(folder => folder.label === "Controlled Copy");

													if (controlledCopyFolder) {
														const controlledCopyId = controlledCopyFolder.id;
														resolve(controlledCopyId);
													} else {
														console.warn("Controlled Copy folder not found.");
														reject("Controlled Copy folder not found.");
													}
												},
												onFailure: function (err) {
													reject("Failed to get Controlled Copy: " + JSON.stringify(err));
												}
											});
										} else {
											reject("Parent ID not found in response");
										}
									} catch (err) {
										reject("Error extracting parent ID: " + err);
									}
								},
								onFailure: function (err) {
									reject("Failed to get parent bookmark: " + JSON.stringify(err));
								}
							});
						},
						onFailure: function (err) {
							reject("CSRF fetch failed: " + JSON.stringify(err));
						}
					});
				});
			});
		},
		fetchBookmarksForDocument: function (docId) {
			return new Promise((resolve, reject) => {
				URLS.getURLs().then(baseUrl => {
					console.log("baseUrl:"+baseUrl);

						const csrfURL = baseUrl + '/resources/v1/application/CSRF';

						WAFData.authenticatedRequest(csrfURL, {
							method: 'GET',
							type: 'json',
							onComplete: function (csrfData) {
								const csrfToken = csrfData.csrf.value;
								const csrfHeaderName = csrfData.csrf.name;

								console.log("Fetching bookmarks for document ID:", docId);
								const docURL = baseUrl + '/resources/v1/FolderManagement/Folder/' + docId + '/getRelatedBookmarks';

								WAFData.authenticatedRequest(docURL, {
									method: 'GET',
									type: 'json',
									headers: {
										'Content-Type': 'application/json',
										'SecurityContext': 'VPLMProjectLeader.Company Name.APTIV INDIA',
										[csrfHeaderName]: csrfToken
									},
									onComplete: function (data) {
										if (data && data.folders && data.folders.length > 0) {
											resolve(data.folders);  // Return all related bookmarks
										} else {
											reject("No bookmarks found for this document.");
										}
									},
									onFailure: function (err) {
										reject(err);
									}
								});
							},
							onFailure: function (err) {
								reject(err);
							}
						});
				});
			});
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
		createContentArea: function () {
            var contentArea = document.createElement("div");
            contentArea.className = "widget-content-area";
            return contentArea;
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
		parmERPDownloadcontent: function (icon, btnonclickFun) {
			const container = new UWA.Element('div', {
				'class': 'parameter-section',
				styles: { padding: '10px' }
			});

			
			container.appendChild(myWidget.dragDropArea("specsheetDrop", 1, "Drop Spec Sheet Document"));

			
			container.appendChild(myWidget.dragDropArea("tplDrop", 3, "Drop up to 3 TPL's"));

			// Download button
			new UWA.Element('button', {
				html: "Generate Controlled Copy",
				'class': 'btn primary',
				styles: {
					marginTop: '15px',
					padding: '8px 16px',
					cursor: 'pointer'
				},
				events: {
					click: btnonclickFun
				}
			}).inject(container);

			return container;
		},
		dragDropArea: function (id, maxFiles, label) {
			const wrapper = new UWA.Element('div', {
				id: id,
				'class': 'YATG_wux-controls-selectionChips',
				styles: {
					border: '2px dashed #ccc',
					padding: '10px',
					margin: '10px 0',
					backgroundColor: '#fafafa',
					minHeight: '60px',
					position: 'relative'
				}
			});

			new UWA.Element('div', {
				html: label,
				styles: {
					position: 'absolute',
					top: '5px',
					left: '10px',
					fontSize: '12px',
					color: '#999'
				}
			}).inject(wrapper);

			wrapper.addEventListener('dragover', function (e) {
				e.preventDefault();
				wrapper.setStyle('border-color', '#0078d4');
			});

			wrapper.addEventListener('dragleave', function () {
				wrapper.setStyle('border-color', '#ccc');
			});

			wrapper.addEventListener('drop', async function (e) {
				e.preventDefault();
				wrapper.setStyle('border-color', '#ccc');

				
				const rawData = e.dataTransfer.getData('text') || '';
				console.log("RAW DROP DATA:", e.dataTransfer.getData('text'));
				let droppedIds = [];
				let droppedName = [];

				try {
					const json = JSON.parse(rawData);
					if (
						json &&
						json.protocol === "3DXContent" &&
						Array.isArray(json.data?.items)
					) {
						droppedItems = json.data.items.map(item => ({
							id: item.objectId,
							name: item.dataelements?.name || item.name || item.displayName
						}));
					}
				} catch (err) {
					console.error("Invalid drag data:", err);
					alert("Unsupported drag format");
					return;
				}

				const existingCount = wrapper.querySelectorAll('.YATG_wux-chip-cell-container').length;
				console.log("Dropped:", droppedIds.length, "Existing:", existingCount, "Max:", maxFiles);

				if (existingCount + droppedIds.length > maxFiles) {
					alert(`You can only drop up to ${maxFiles} document(s) here.`);
					return;
				}

				
				const existingIds = Array.from(wrapper.querySelectorAll('.YATG_wux-chip-cell-label')).map(el => el.id);
				const filteredNewItems = droppedItems.filter(item => !existingIds.includes(item.id));

				for (const item of filteredNewItems) {
					const chip = new UWA.Element('div', {
						'class': 'YATG_wux-chip-cell-container',
						html: `<li class="YATG_wux-chip-cell-label" id="${item.id}">${item.name}</li>`,
						draggable: 'true',
						styles: {
							padding: '5px',
							backgroundColor: '#e0e0e0',
							marginTop: '5px'
						}
					}).inject(wrapper);
				}
			});

			return wrapper;
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

            //button.appendChild(buttonIcon);
            button.appendChild(buttonTextNode);
            button.appendChild(caretSpan);

            if (btnonclickFun) {
                button.addEventListener("click", btnonclickFun);
            }
            return button;
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
