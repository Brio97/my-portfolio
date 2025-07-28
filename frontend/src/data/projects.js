// Curated project list
export const projects = [
  {
    id: 'ecommerce-demo',
    name: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with modern UI/UX, shopping cart, payment integration, and admin dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    homepage: 'https://quick-cart-puce-five.vercel.app', // Replace with actual URL
    html_url: 'https://github.com/Brio97/QuickCart', // Replace with actual repo
    stargazers_count: 12,
    forks_count: 3,
    isPrivate: false,
    screenshot: '/images/ecommerce-preview.png', // Add screenshot to public/images/
    features: [
      'User authentication and authorization',
      'Product catalog with search and filtering',
      'Shopping cart and checkout process',
      'Stripe payment integration',
      'Admin dashboard for inventory management',
      'Responsive design for all devices',
      'Order tracking and history'
    ],
    demo: 'https://quick-cart-puce-five.vercel.app' // Live demo URL
  },
  {
    id: 'portfolio-website',
    name: 'Portfolio Website (Current website)',
    description: 'Modern portfolio website with dark/light theme, multilingual support, and responsive design.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Netlify'],
    homepage: 'https://moderndevspace.netlify.app',
    html_url: 'https://github.com/Brio97/my-portfolio',
    stargazers_count: 8,
    forks_count: 2,
    isPrivate: false,
    screenshot: '/images/portfolio-preview.png',
    features: [
      'Responsive design with modern UI',
      'Dark/Light theme toggle',
      'Multilingual support',
      'Contact form with email integration',
      'Smooth animations with Framer Motion',
      'Serverless deployment on Netlify'
    ],
    demo: 'https://moderndevspace.netlify.app'
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management System',
    description: 'Full-stack inventory management system for logistics and supply chain operations.',
    technologies: ['React', 'Flask', 'Python', 'SQLAlchemy', 'JavaScript'],
    homepage: 'https://fuata-tech-client.onrender.com',
    html_url: 'https://github.com/Brio97/inventory_management_system',
    stargazers_count: 0,
    forks_count: 0,
    isPrivate: true,
    screenshot: '/images/inventory-preview.png', // Add screenshot to public/images/
    features: [
      'Full-stack Flask/React application',
      'Inventory tracking and management',
      'RESTful API with Flask-RESTful',
      'Database management with SQLAlchemy',
      'User-friendly React frontend',
      'Logistics and supply chain operations'
    ],
    demo: 'https://fuata-tech-client.onrender.com'
  }
];

// Helper function to get all unique technologies
export const getAllTechnologies = () => {
  const techSet = new Set();
  projects.forEach(project => {
    project.technologies.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

// Helper function to filter projects by technology
export const filterProjectsByTech = (selectedTech) => {
  if (!selectedTech || selectedTech === 'All') {
    return projects;
  }
  return projects.filter(project => 
    project.technologies.includes(selectedTech)
  );
};
