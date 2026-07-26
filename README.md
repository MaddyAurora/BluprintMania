# 🌌 BluprintMania

Welcome to **BluprintMania** — a dynamic, and highly interactive node-based blueprint editor. Built with modern web technologies, it allows you to map out your ideas, design architectures, and create stunning visual workflows with a sleek glassmorphism aesthetic.

<img width="1905" height="910" alt="Screenshot 2026-07-27 021212" src="https://github.com/user-attachments/assets/421d9a3e-a831-48b9-a93e-20c55de63e9d" />


---

## ✨ Features

- **🎨 Premium Aesthetic**: A gorgeous dark mode UI with glassmorphic panels, vibrant accent colors, and buttery-smooth micro-animations.
- **♾️ Infinite Canvas**: Pan and zoom across an infinite workspace to build blueprints of any size.
- **🧩 Dynamic Custom Nodes**: 
  - Change node names and assign distinct color accents.
  - Add detailed multi-line notes.
  - Smoothly resize nodes from the corners to automatically reveal expanded content.
- **🔗 Smart Connections**: Easily link nodes together with thick, interactive "cables."
- **💾 Import/Export to JSON**: One-click serialization of your entire blueprint (nodes, positions, edges, and notes) into a structured JSON file.

---

## 🛠️ Technology Stack

- **[React 18](https://react.dev/)**: For a robust, component-driven UI architecture.
- **[Vite](https://vitejs.dev/)**: For lightning-fast Hot Module Replacement (HMR) and optimized builds.
- **[@xyflow/react](https://reactflow.dev/)**: Powering the core node-based engine, viewport management, and interactive edges.
- **[Lucide React](https://lucide.dev/)**: For clean, modern SVG icons.
- **Vanilla CSS**: Custom-tailored CSS variables and flexbox/grid layouts ensuring complete design flexibility without the overhead of UI frameworks.

---

## 🚀 Getting Started

Follow these instructions to run BluprintMania locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Updating

1. **Navigate to the project directory**.
   Download the project zip file or use git and run the following command:
   ```bash
   git clone https://github.com/MaddyAurora/BluprintMania
   ```

2. **Install / Update Dependencies**:
   Simply double-click the `install.bat` file! This will automatically check and install all required dependencies. To update, run `update.bat` and it will safely update to the latest version.

3. **Start the development server**:
   Double-click the `start_server.bat` file.

4. **Open the app**:
   Navigate to the URL provided in your terminal (usually `http://localhost:5173`).

---

## 💡 How to Use

1. **Add Nodes**: Click the "Add Node" button in the top-left toolbar to spawn a new block.
2. **Move & Resize**: Drag nodes around the canvas. Grab the square corner handles to stretch a node and reveal its detailed notes.
3. **Connect**: Click and drag from the large colored dot at the bottom of one node to the top dot of another.
4. **Customize**: Click on any node to open the floating inspector panel on the right. Change its name, color, and type out your notes.
5. **Export**: Click the "Export" button to instantly download your current blueprint configuration as a `.json` file.

---

*Crafted with precision for optimal brainstorming.*
