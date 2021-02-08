import React from 'react';
import { Route, Redirect } from 'react-router-dom';


// Защищенный роут на случай попытки входа в комнату неавторизованного пользователя
export default function ProtectedRoute({ component: Component, ...props }) {
    return (
        <Route>
            {
                props.joined ? <Component {...props} /> : <Redirect to='/' />
            }
        </Route>
    )
}