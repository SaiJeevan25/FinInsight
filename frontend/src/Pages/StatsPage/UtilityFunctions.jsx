// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Get color for category based on index
  export const getColorForCategory = (index) => {
    const colors = [
      '#4F46E5', // indigo
      '#7C3AED', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
      '#10B981'  // emerald
    ];
    
    return colors[index % colors.length];
  };
  
  // Get month name from index
  export const getMonthName = (index) => {
    const monthNames = [
      "Jan", "Feb", "March", "April", "May", "June", 
      "July", "August", "Sept", "October", "Nov", "Dec"
    ];
    return monthNames[index];
  };
  
  // Get severity color based on severity type and dark mode
  export const getSeverityColor = (severity, isDark) => {
    if (severity === "success") return isDark ? "text-green-400" : "text-green-600";
    if (severity === "warning") return isDark ? "text-yellow-400" : "text-yellow-600";
    if (severity === "danger") return isDark ? "text-red-400" : "text-red-600";
    return isDark ? "text-blue-400" : "text-blue-600"; // info
  };
  
  // Get severity background color
  export const getSeverityBgColor = (severity, isDark) => {
    if (severity === "success") return isDark ? "bg-green-900/30" : "bg-green-100";
    if (severity === "warning") return isDark ? "bg-yellow-900/30" : "bg-yellow-100";
    if (severity === "danger") return isDark ? "bg-red-900/30" : "bg-red-100";
    return isDark ? "bg-blue-900/30" : "bg-blue-100"; // info
  };