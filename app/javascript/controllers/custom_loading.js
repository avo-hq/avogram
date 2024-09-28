import "@hotwired/stimulus";

const controllerAttribute = "data-controller";

export function eagerLoadControllersFrom(lookupPaths, application) {
  Object.entries(lookupPaths).map((entry) => {
    const [under, buildPathname] = entry;

    const paths = Object.keys(parseImportmapJson()).filter((path) =>
      path.match(buildPathname(under))
    );

    paths.forEach((path) => {
      registerControllerFromPath(path, under, application);
    });
  });
}

function parseImportmapJson() {
  return JSON.parse(document.querySelector("script[type=importmap]").text)
    .imports;
}

function canRegisterController(name, application) {
  return !application.router.modulesByIdentifier.has(name);
}

function registerController(name, module, application) {
  if (canRegisterController(name, application)) {
    application.register(name, module.default);
  }
}

function registerControllerFromPath(path, under, application) {
  let name = path
    .replace(new RegExp(`^${under}/`), "")
    .replace("controller", "")
    .replace(/\//g, "--")
    .replace(/_/g, "-");

  if (name.endsWith("--")) name = name.slice(0, -2);
  if (name.endsWith("-")) name = name.slice(0, -1);

  if (canRegisterController(name, application)) {
    import(path)
      .then((module) => registerController(name, module, application))
      .catch((error) =>
        console.error(`Failed to register controller: ${name} (${path})`, error)
      );
  }
}

// Lazy load controllers registered beneath the `under` path in the import map to the passed application instance.
export function lazyLoadControllersFrom(
  under,
  application,
  element = document
) {
  lazyLoadExistingControllers(under, application, element);
  lazyLoadNewControllers(under, application, element);
}

function lazyLoadExistingControllers(under, application, element) {
  queryControllerNamesWithin(element).forEach((controllerName) => {
    loadController(controllerName, under, application);
  });
}

function lazyLoadNewControllers(under, application, element) {
  new MutationObserver((mutationsList) => {
    for (const { attributeName, target, type } of mutationsList) {
      switch (type) {
        case "attributes": {
          if (
            attributeName == controllerAttribute &&
            target.getAttribute(controllerAttribute)
          ) {
            extractControllerNamesFrom(target).forEach((controllerName) =>
              loadController(controllerName, under, application)
            );
          }
        }

        case "childList": {
          lazyLoadExistingControllers(under, application, target);
        }
      }
    }
  }).observe(element, {
    attributeFilter: [controllerAttribute],
    subtree: true,
    childList: true,
  });
}

function queryControllerNamesWithin(element) {
  return Array.from(element.querySelectorAll(`[${controllerAttribute}]`))
    .map(extractControllerNamesFrom)
    .flat();
}

function extractControllerNamesFrom(element) {
  return element
    .getAttribute(controllerAttribute)
    .split(/\s+/)
    .filter((content) => content.length);
}

function loadController(name, lookupPaths, application) {
  if (canRegisterController(name, application)) {
    let errors = [];
    let success = false;

    let promises = Object.entries(lookupPaths).map((entry) => {
      const [under, buildPathname] = entry;

      return import(buildPathname(name))
        .then((module) => {
          registerController(name, module, application);
          success = true;
        })
        .catch((error) => {
          errors.push([buildPathname(name), error]);
        });
    });

    // wait for all promises to be resolved
    Promise.all(promises).then(() => {
      if (!success) {
        console.error(`Failed to register controller: ${name}`, errors);
      }
    });
  }
}
