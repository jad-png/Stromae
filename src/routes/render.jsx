import React, { Component } from "react";
import ProtectedRoute from "./protectedRoute";
import PropTypes from "prop-types";

const render = (routes) => {
    return routes.map(({ path, component: Component, layout: layout, roles }) => {
        const content = roles ? (
            <ProtectedRoute allowedRoles={roles}>
                <Component />
            </ProtectedRoute>
        ) : (
            <Component />
        );

        return (
            <Route key={path} path={path} element={Layout ? <Layout /> : content}>
                {Layout && <Route index element={content} />}
            </Route>
        );
    });
}

render.PropTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            Compoennt: PropTypes.elementType.isRequired,
            Layout: PropTypes.elementType,
            role: PropTypes.arrayOf(PropTypes.number)
        }).isRequired
    )
}

export default render;