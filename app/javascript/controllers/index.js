// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "controllers/application";
import { eagerLoadControllersFrom } from "controllers/custom_loading";
eagerLoadControllersFrom(
  {
    controllers: (name) => new RegExp(`^${name}/.*_controller$`), // controllers/**/*_controller
    components: (name) => new RegExp(`^components/.*$`), // components/**
  },
  application
);
