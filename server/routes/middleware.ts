type AsyncHandler = (req: any, res: any, next: any) => Promise<unknown>;

export function withAsync(handler: AsyncHandler) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}
