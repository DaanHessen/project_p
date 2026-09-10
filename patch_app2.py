import re

with open("src/App.tsx", "r") as f:
    ts = f.read()

# Add import
import_stmt = r'''import DagboekPage from "./pages/DagboekPage";'''
new_import = r'''import DagboekPage from "./pages/DagboekPage";
import { NotFoundPage } from "./pages/NotFoundPage";'''
ts = ts.replace(import_stmt, new_import)

# Add route rendering
old_render = r'''        ) : route === "planner" ? (
          <PlannerPage onNavigateBack={() => navigate("/minor")} />
        ) : ('''

new_render = r'''        ) : route === "planner" ? (
          <PlannerPage onNavigateBack={() => navigate("/minor")} />
        ) : route === "404" ? (
          <NotFoundPage onNavigateHome={() => navigate("/")} />
        ) : ('''

ts = ts.replace(old_render, new_render)

with open("src/App.tsx", "w") as f:
    f.write(ts)
