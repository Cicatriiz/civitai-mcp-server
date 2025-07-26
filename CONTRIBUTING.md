# Contributing to Civitai MCP Server

Thank you for your interest in contributing to the Civitai MCP Server! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- A Civitai API key (for testing)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/civitai-mcp-server.git
   cd civitai-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   export CIVITAI_API_KEY="your_test_api_key"
   ```

4. **Build and test**
   ```bash
   npm run build
   npm test
   ```

## 🛠️ Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm test
   node test.js  # Run basic tests
   node comprehensive-test.js  # Run comprehensive tests
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Convention

We use conventional commits. Please format your commit messages as:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
- `feat: add model generation tool`
- `fix: handle rate limiting errors`
- `docs: update API reference`

## 📝 Code Style

### TypeScript Guidelines
- Use TypeScript for all new code
- Prefer explicit types over `any`
- Use Zod for runtime validation
- Follow existing naming conventions

### Code Organization
- Keep functions focused and small
- Use descriptive variable and function names
- Add JSDoc comments for public APIs
- Maintain separation between client and server logic

### Error Handling
- Always handle errors gracefully
- Provide meaningful error messages
- Use proper HTTP status codes
- Log errors appropriately

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test files
node test.js
node comprehensive-test.js

# Test in development mode
npm run dev
```

### Writing Tests
- Add tests for all new functionality
- Test both success and error cases
- Use realistic test data
- Mock external API calls when appropriate

### Test Structure
```typescript
// Example test structure
describe('Tool: search_models', () => {
  it('should return models for valid query', async () => {
    // Test implementation
  });

  it('should handle invalid parameters', async () => {
    // Error case testing
  });
});
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for all public functions
- Document complex logic with inline comments
- Keep README.md up to date
- Update API reference for new tools

### Documentation Standards
```typescript
/**
 * Search for models on Civitai with filters
 * @param query - Search query string
 * @param options - Additional search options
 * @returns Promise resolving to search results
 */
async function searchModels(query: string, options: SearchOptions): Promise<SearchResult> {
  // Implementation
}
```

## 🚦 Pull Request Process

### Before Submitting
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changes are tested manually
- [ ] Commit messages follow convention

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested manually
- [ ] Added automated tests
- [ ] All existing tests pass

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed the code
- [ ] Added comments for complex logic
- [ ] Updated documentation
```

### Review Process
1. Automated checks must pass
2. At least one maintainer review required
3. Address all feedback before merge
4. Squash commits when merging

## 🐛 Reporting Issues

### Bug Reports
Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)
- Error messages and logs

### Feature Requests
Use the feature request template and include:
- Problem description
- Proposed solution
- Use cases and benefits
- Implementation considerations

## 🎯 Priority Areas

We're particularly interested in contributions for:

### High Priority
- **Error handling improvements**
- **Performance optimizations**
- **Additional test coverage**
- **Documentation enhancements**

### Medium Priority
- **New Civitai API endpoints**
- **Enhanced filtering options**
- **Rate limiting improvements**
- **Caching mechanisms**

### Future Features
- **Image generation tools**
- **Model training integration**
- **User authentication**
- **Webhook support**

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Celebrate diverse perspectives

### Communication
- Use GitHub issues for bug reports
- Use GitHub discussions for questions
- Join community discussions respectfully
- Provide clear and helpful responses

## 📖 Resources

### Documentation
- [Civitai API Documentation](https://github.com/civitai/civitai/wiki/REST-API-Reference)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools
- [Zod Documentation](https://zod.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## ❓ Getting Help

### Questions?
- Check existing issues and discussions
- Review the documentation
- Ask in GitHub discussions
- Reach out to maintainers

### Stuck?
- Break down the problem
- Ask for help early and often
- Share your approach and blockers
- Collaborate on solutions

---

Thank you for contributing to the Civitai MCP Server! Your efforts help make AI model discovery accessible to everyone. 🎉
