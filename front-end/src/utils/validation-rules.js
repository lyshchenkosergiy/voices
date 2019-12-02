export default {
  data: () => ({
    rule_required: (v) => !!v || 'Field is required!',
    rule_email: (v) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v) || 'Invalid email!',
    rule_length: (min, max) =>
      (v) => {
        const valid = max
          ? v.toString().length >= min && v.toString().length <= max
          : v.toString().length === min;
        const error = max ? `Length should be between ${min} and ${max}!` : `Length should be equal ${min}!`;
        return valid || error;
      },
    rule_alpha_num: (v) => /^[a-zA-Z0-9_]*$/.test(v) || 'Field should contain only letters, numbers and underscores!',
    rule_alpha: (v) => /^[a-zA-Z]*$/.test(v) || 'Field should contain only letters!',
    rule_num: (v) => /^[0-9]*$/.test(v) || 'Field should contain only numbers!'
  })
};
