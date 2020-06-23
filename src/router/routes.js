export default [
    {
        path: '/',
        name: 'home',
        component: () => import("../components/Home")
    },
    {
        path: '/dog/:dog_id/edit',
        name: 'dog_edit',
        component: () => import("../components/NewDog")
    },
    {
        path: '/dog/:dog_id',
        name: 'dog',
        component: () => import("../components/Overview"),
        children: [
            {
                name: 'dog_passport',
                path: 'passport',
                component: () => import("../components/dogTabs/DogSummary")
            },
            {
                name: 'dog_health',
                path: 'health',
                component: () => import("../components/dogTabs/DogHealth")
            },

        ]
    },
    {
        path: '/NewDog',
        name: 'dog_new',
        component: () => import("../components/NewDog")},
    {
        path: '/owner/:owner_id',
        name: 'owner',
        component: () => import("../components/Owner")
    },
    {
        path: '/edit_profile',
        name: 'owner_edit',
        component: () => import("../components/OwnerEdit")
    }
]