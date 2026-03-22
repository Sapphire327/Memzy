export default defineNuxtRouteMiddleware((to, from) => {
	const session = useUserSession()
	if (!session.loggedIn.value){
		return navigateTo('/auth/signin')
	}
})
