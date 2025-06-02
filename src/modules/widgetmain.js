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

            var tile1 = myWidget.createTileElement("Report 1", imageURL + "I_Switch.png", "Report 1", myWidget.createSecondSidebar);
            var tile2 = myWidget.createTileElement("TPL Creation", imageURL + "I_Switch.png", "TPL Creation", myWidget.createPrjMng);

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
            var sideBar2 = document.querySelector(".second-sidebar");
            sideBar2.style.display = "block";
        },
		createPrjMng: function () {
			let sideBar2 = document.querySelector(".second-sidebar");


			if (!sideBar2) {
				sideBar2 = document.createElement("div");
				sideBar2.className = "second-sidebar";
				document.body.appendChild(sideBar2);
			}

			sideBar2.style.display = "block";
			sideBar2.innerHTML = "";


			const header = document.createElement("h2");
			header.textContent = "Create Physical Product";
			header.className = "sidebar-header";

			const titleInput = document.createElement("input");
			titleInput.type = "text";
			titleInput.placeholder = "Enter Title";
			titleInput.className = "form-input";

			const descInput = document.createElement("textarea");
			descInput.placeholder = "Enter Description";
			descInput.className = "form-textarea";
			
			const dropZone = document.createElement("div");
			dropZone.className = "drop-zone";
			dropZone.textContent = "Drag & Drop Project Space here";
			dropZone.style.border = "2px dashed #ccc";
			dropZone.style.padding = "10px";
			dropZone.style.marginBottom = "10px";
			dropZone.style.textAlign = "center";

			let droppedProjectSpace = null;

			
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
					if (parsed && parsed.objectId && parsed.envId && parsed.source === "3DX") {
						droppedProjectSpace = parsed;
						dropZone.textContent = `Project: ${parsed.objectLabel || parsed.objectId}`;
					} else {
						dropZone.textContent = "Invalid drop – Not a Project Space.";
					}
				} catch (err) {
					console.error("Drop parsing failed", err);
					dropZone.textContent = "Drop error";
				}
			});
			
			const createBtn = document.createElement("button");
			createBtn.textContent = "Create Physical Product";
			createBtn.className = "form-button";

			const resultBox = document.createElement("div");
			resultBox.className = "result-box";

			createBtn.onclick = function () {
				const title = titleInput.value.trim();
				const description = descInput.value.trim();

				if (!title) {
					alert("Title is required.");
					return;
				}

				const payload = {
					items: [{
						title: title,
						description: description,
						type: "Physical Product"
					}]
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					data: JSON.stringify(payload),
					onComplete: function (response) {
						try {
							const resObj = JSON.parse(response);
							resultBox.innerHTML = `<p>Physical Product created with ID: <strong>${resObj.data[0].id}</strong></p>`;
						} catch (e) {
							resultBox.innerHTML = "<p>Failed to create product.</p>";
							console.error(e);
						}
					},
					onFailure: function (err) {
						resultBox.innerHTML = "<p>Error creating product.</p>";
						console.error(err);
					}
				};

				const url = "/resources/v1/modeler/dspfl/physicalproducts";
				WAFData.authenticatedRequest(url, options);
			};

			// Append everything to the second-sidebar
			sideBar2.appendChild(header);
			sideBar2.appendChild(titleInput);
			sideBar2.appendChild(descInput);
			sideBar2.appendChild(dropZone);
			sideBar2.appendChild(createBtn);
			sideBar2.appendChild(resultBox);
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
		EPRCompFun: async function () {
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
												resolve(docData.data[0]);  // Return first document object
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
		mergeDocumentsIntoTable: function(doc1, doc2) {
			const headers = ["Name", "Policy", "State"];
			const rows = [
				[doc1.dataelements.name, doc1.dataelements.policy, doc1.dataelements.state],
				[doc2.dataelements.name, doc2.dataelements.policy, doc2.dataelements.state]
			];

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
		parmERPDownloadcontent: function (downloadIcon, btnonclickFun) {
            const div4 = this.createDiv("accordion-item active");
            const accordionTitle = this.createDiv("accordion-title");
            const caretIcon = this.createElementWithClass("i", "caret-left");
            //const titleText = document.createTextNode("Download Document Configuration");
            accordionTitle.appendChild(caretIcon);
            //accordionTitle.appendChild(titleText);
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

            btnContainerdiv.appendChild(this.createButtonCell("", "Generate Controlled Copy", "Generate", btnonclickFun));
            contentDiv.appendChild(btnContainerdiv);

            div4.appendChild(contentWrapper);

            return div4;
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
