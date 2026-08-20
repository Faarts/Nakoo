export const calculateAge = (dateString) => {
  if (!dateString) return '';
  const birth = new Date(dateString);
  const today = new Date();
  
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += today.getMonth();
  
  if (months < 12) {
    return `${months} bulan`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths === 0 ? `${years} tahun` : `${years} thn ${remainingMonths} bln`;
};
