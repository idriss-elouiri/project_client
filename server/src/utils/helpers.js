export function formatZodError(error) {
    return error.issues.reduce((acc, issue) => {
      const field = issue.path.join(".");
      acc[field] = issue.message;
      return acc;
    }, {});
  }