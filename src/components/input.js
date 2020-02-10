const Input = (props) => {
  const template = `
    <input
    data-id="${props.data}"
    class="${props.class}"
    id="${props.id}"
    value="${props.value || ''}"
    placeholder="${props.placeholder}"
    maxlength="${props.maxlength}"
    title="${props.title}"
    type="${props.type}" required>
    `;

  return template;
};

export default Input;
