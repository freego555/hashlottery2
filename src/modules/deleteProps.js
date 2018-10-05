/**
 * Delete props
 *
 * @param {object} obj
 * @param {array}  props - Array of props for delete
 *
 * @return {object} - New object
 * */

export default function(obj, props) {
  const newObj = { ...obj };

  if (Array.isArray(props) && props.length) {
    props.forEach(prop => {
      delete newObj[prop];
    });
  }

  return newObj;
}
