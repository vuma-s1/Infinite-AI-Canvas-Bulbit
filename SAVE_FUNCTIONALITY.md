# Save Functionality Documentation

## Overview
The Bulbit AI Canvas now includes comprehensive save functionality that allows users to save, load, and manage their design projects.

## Features

### 🚀 Auto-Save
- **Automatic saving**: Your work is automatically saved every 30 seconds
- **Visual feedback**: A green "Auto-saved" indicator appears when auto-save occurs
- **Smart saving**: Only saves when changes are detected (every 10+ seconds)

### 💾 Manual Save
- **Save Project**: Click the save button (💾) in the toolbar or press `Ctrl+S`
- **Project naming**: Give your projects custom names and descriptions
- **Tags**: Add tags to organize your projects (e.g., "logo", "branding", "mockup")

### 📁 Project Management
- **Load Projects**: Click the folder button (📁) or press `Ctrl+O`
- **Search**: Search through your saved projects by name, description, or tags
- **Duplicate**: Create copies of existing projects
- **Delete**: Remove projects you no longer need

### 📤 Export Options
- **Export as JSON**: Download project data for backup or sharing
- **Export as PNG**: Save canvas as image (coming soon)

## How to Use

### Saving a Project
1. Design your workflow on the canvas
2. Click the save button (💾) in the top-right toolbar
3. Enter a project name (required)
4. Add an optional description
5. Add tags separated by commas
6. Click "Save Project"

### Loading a Project
1. Click the folder button (📁) in the toolbar
2. Browse your saved projects
3. Use the search bar to find specific projects
4. Click on a project to load it

### Managing Projects
- **Duplicate**: Hover over a project card and click the copy icon
- **Delete**: Hover over a project card and click the trash icon
- **Export**: Hover over a project card and click the download icon

## Keyboard Shortcuts
- `Ctrl+S` (or `Cmd+S` on Mac): Save project
- `Ctrl+O` (or `Cmd+O` on Mac): Load project
- `Ctrl+E` (or `Cmd+E` on Mac): Export project

## Data Storage
- Projects are saved locally in your browser's localStorage
- No data is sent to external servers
- Projects persist between browser sessions
- Maximum storage depends on your browser's localStorage limit

## Technical Details

### What Gets Saved
- All nodes and their positions
- All connections between nodes
- Node data (text, images, settings)
- Canvas zoom and position
- Template information
- Timestamp and metadata

### Auto-Save Behavior
- Triggers every 30 seconds automatically
- Also triggers when you make changes (with 10-second cooldown)
- Saves to temporary storage if no project is currently loaded
- Updates existing projects in real-time

### Project Structure
```json
{
  "id": "project-1234567890",
  "name": "My Design Project",
  "description": "A beautiful logo design",
  "nodes": [...],
  "edges": [...],
  "template": "Basic Generation",
  "thumbnail": "data:image/svg+xml;base64,...",
  "createdAt": 1234567890,
  "updatedAt": 1234567890,
  "tags": ["logo", "branding", "design"]
}
```

## Troubleshooting

### Projects Not Saving
- Check if your browser supports localStorage
- Ensure you have sufficient storage space
- Try refreshing the page and saving again

### Can't Load Projects
- Verify the project exists in your saved projects list
- Check if the project data is corrupted
- Try clearing browser cache and reloading

### Auto-Save Not Working
- Ensure the page is active (not minimized)
- Check browser console for errors
- Verify JavaScript is enabled

## Future Enhancements
- Cloud storage integration
- PNG export functionality
- Project sharing between users
- Version history and branching
- Collaborative editing
- Project templates marketplace
