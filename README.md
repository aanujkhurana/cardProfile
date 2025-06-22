# 🚀 Anuj Khurana's Interactive Portfolio

A modern, interactive portfolio website built with Vue 3 and enhanced with AI-powered chat functionality. This project showcases Anuj's skills, projects, and experience through an engaging user interface with real-time AI assistance.

![Portfolio Preview](https://img.shields.io/badge/Vue-3.5.13-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-412991?style=for-the-badge&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Theme Toggle**: Seamless theme switching with smooth transitions
- **Interactive Components**: Engaging animations and hover effects
- **Professional Layout**: Clean, modern design showcasing skills and projects

### 🤖 **AI-Powered Chat Assistant**
- **Real-time Conversations**: Interactive chat with GPT-3.5-turbo
- **Context-Aware Responses**: AI trained on Anuj's portfolio data
- **Quick Questions**: Pre-defined question suggestions for easy interaction
- **Professional Guidance**: AI assistant provides information about skills, projects, and experience

### 📱 **Portfolio Sections**
- **Skills Showcase**: Detailed technical skills with proficiency levels
- **Project Gallery**: Comprehensive project descriptions with tech stacks
- **Experience Timeline**: Professional journey and achievements
- **Contact Information**: Multiple ways to get in touch
- **Social Links**: Direct access to GitHub, LinkedIn, and other profiles

### 🔧 **Technical Features**
- **Vue 3 Composition API**: Modern reactive framework
- **Vite Build Tool**: Fast development and optimized production builds
- **CORS-Enabled API**: Secure proxy for OpenAI API calls
- **Environment Configuration**: Flexible setup for different environments

## 🏗️ Project Structure

```
cardProfile/
├── frontend/                 # Vue 3 frontend application
│   ├── src/
│   │   ├── components/       # Vue components
│   │   │   ├── Card.vue      # Main portfolio card
│   │   │   ├── Chatbox.vue   # AI chat interface
│   │   │   ├── Skills.vue    # Skills section
│   │   │   ├── Projects.vue  # Projects showcase
│   │   │   ├── Experiences.vue # Experience timeline
│   │   │   ├── Contact.vue   # Contact information
│   │   │   └── ThemeToggle.vue # Theme switcher
│   │   ├── lib/
│   │   │   ├── chatbox/      # Chat system configuration
│   │   │   └── sanity_client.js # CMS integration
│   │   ├── assets/           # Images and static files
│   │   ├── App.vue           # Main application component
│   │   └── main.js           # Application entry point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── openai-proxy/             # Vercel serverless API
│   ├── api/
│   │   └── chat.js           # OpenAI API proxy
│   ├── vercel.json           # Vercel configuration
│   └── package.json          # API dependencies
└── README.md                 # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cardProfile.git
cd cardProfile
```

### 2. Set Up Environment Variables
Create a `.env` file in the `frontend` directory:
```bash
cd frontend
touch .env
```

Add your OpenAI API key:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install API dependencies
cd ../openai-proxy
npm install
```

### 4. Deploy the API
```bash
# Deploy to Vercel (make sure you have Vercel CLI installed)
cd openai-proxy
vercel --prod
```

### 5. Start Development Server
```bash
# Start the frontend development server
cd ../frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration

### Frontend Configuration
The frontend uses Vite with the following features:
- **Hot Module Replacement**: Instant updates during development
- **Proxy Configuration**: CORS-free API calls during development
- **Environment Variables**: Secure API key management

### API Configuration
The OpenAI proxy is deployed on Vercel with:
- **CORS Headers**: Properly configured for cross-origin requests
- **Environment Variables**: Secure API key storage
- **Error Handling**: Comprehensive error responses

### Chat System Configuration
The AI chat system is configured in `frontend/src/lib/chatbox/`:
- **System Prompt**: Customized for Anuj's portfolio
- **Context Data**: Structured information about skills, projects, and experience
- **Response Formatting**: Markdown support for rich responses

## 🎯 Customization

### Updating Portfolio Content
1. **Profile Information**: Edit `frontend/src/lib/chatbox/contextData.js`
2. **Skills**: Update the skills array with your technical expertise
3. **Projects**: Add your projects with descriptions, tech stacks, and links
4. **Experience**: Modify the experience timeline
5. **Contact**: Update contact information and social links

### Styling
- **Theme Colors**: Modify CSS variables in `frontend/src/style.css`
- **Component Styling**: Each component has scoped styles
- **Responsive Design**: Mobile-first approach with breakpoints

### AI Chat Customization
- **System Prompt**: Edit `frontend/src/lib/chatbox/systemPrompt.js`
- **Response Behavior**: Modify the AI instructions and personality
- **Quick Questions**: Update suggested questions in `Chatbox.vue`

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
cd frontend
npm run build

# Deploy to your preferred hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

### API Deployment
```bash
# Deploy to Vercel
cd openai-proxy
vercel --prod
```

### Environment Variables
Make sure to set the following environment variables in your deployment:
- `OPENAI_API_KEY`: Your OpenAI API key
- `VITE_API_URL`: Your deployed API URL (optional)

## 🔒 Security

- **API Key Protection**: OpenAI API key is stored securely in environment variables
- **CORS Configuration**: Properly configured for secure cross-origin requests
- **Input Validation**: All user inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling without exposing sensitive information

## 🛠️ Technologies Used

### Frontend
- **Vue 3**: Progressive JavaScript framework
- **Vite**: Fast build tool and dev server
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript ES6+**: Modern JavaScript features

### Backend
- **Vercel**: Serverless deployment platform
- **OpenAI API**: GPT-3.5-turbo for AI chat functionality
- **Edge Runtime**: Fast, global API responses

### Development Tools
- **Git**: Version control
- **npm**: Package management
- **Vercel CLI**: Deployment tool

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 About Anuj Khurana

Anuj is a passionate software engineer with expertise in:
- **Frontend Development**: Vue.js, React, JavaScript, TypeScript
- **Backend Development**: Node.js, Python, APIs
- **AI/ML**: OpenAI integration, LLM applications
- **Cloud Services**: AWS, Vercel, serverless architecture

## 📞 Contact

- **Email**: [Your Email]
- **LinkedIn**: [Your LinkedIn]
- **GitHub**: [Your GitHub]
- **Website**: [Your Website]

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by Anuj Khurana