import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard/layout.tsx", [
    index("routes/dashboard/overview.tsx"),
    route("optimizer", "routes/dashboard/optimizer.tsx"),
    route("builder", "routes/dashboard/builder.tsx"),
    route("executive", "routes/dashboard/executive.tsx"),
    route("editor/:id", "routes/dashboard/editor.tsx"),
  ]),
  ...devRoutes,
] satisfies RouteConfig;
