/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as JoinIndexImport } from './routes/join/index'
import { Route as WorkspaceWorkspaceIdImport } from './routes/workspace/$workspaceId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const JoinIndexRoute = JoinIndexImport.update({
  id: '/join/',
  path: '/join/',
  getParentRoute: () => rootRoute,
} as any)

const WorkspaceWorkspaceIdRoute = WorkspaceWorkspaceIdImport.update({
  id: '/workspace/$workspaceId',
  path: '/workspace/$workspaceId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/workspace/$workspaceId': {
      id: '/workspace/$workspaceId'
      path: '/workspace/$workspaceId'
      fullPath: '/workspace/$workspaceId'
      preLoaderRoute: typeof WorkspaceWorkspaceIdImport
      parentRoute: typeof rootRoute
    }
    '/join/': {
      id: '/join/'
      path: '/join'
      fullPath: '/join'
      preLoaderRoute: typeof JoinIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/workspace/$workspaceId': typeof WorkspaceWorkspaceIdRoute
  '/join': typeof JoinIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/workspace/$workspaceId': typeof WorkspaceWorkspaceIdRoute
  '/join': typeof JoinIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/workspace/$workspaceId': typeof WorkspaceWorkspaceIdRoute
  '/join/': typeof JoinIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/workspace/$workspaceId' | '/join'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/workspace/$workspaceId' | '/join'
  id: '__root__' | '/' | '/workspace/$workspaceId' | '/join/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  WorkspaceWorkspaceIdRoute: typeof WorkspaceWorkspaceIdRoute
  JoinIndexRoute: typeof JoinIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  WorkspaceWorkspaceIdRoute: WorkspaceWorkspaceIdRoute,
  JoinIndexRoute: JoinIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/workspace/$workspaceId",
        "/join/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/workspace/$workspaceId": {
      "filePath": "workspace/$workspaceId.tsx"
    },
    "/join/": {
      "filePath": "join/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
