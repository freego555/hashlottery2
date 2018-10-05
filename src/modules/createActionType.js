/**
 * Create success or error http type
 *
 * @param {string} currentType
 * @param {string} newType
 *
 * @return string
 **/

export default function(currentType, newType) {
  return newType === 'err' ? `${currentType}_ERROR` : `${currentType}_SUCCESS`;
}
