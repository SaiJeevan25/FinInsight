// src/Components/ui/card.jsx
export function Card({ children }) {
    return <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">{children}</div>;
  }
  
  export function CardHeader({ children }) {
    return <div className="font-semibold text-lg">{children}</div>;
  }
  
  export function CardTitle({ children }) {
    return <h3 className="text-xl font-bold">{children}</h3>;
  }
  
  export function CardContent({ children }) {
    return <div className="mt-2">{children}</div>;
  }
  