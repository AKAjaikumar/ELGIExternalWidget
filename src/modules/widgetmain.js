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

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    attributeContainer.appendChild(wrapper);
});
