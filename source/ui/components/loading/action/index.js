export const showLoading = () => ({ type: 'SHOW_LOADING' });
export const hideLoading = () => ({ type: 'HIDE_LOADING' });

export function isLoading(isLoading) {
    return {
        type: isLoading ? 'SHOW_LOADING' : 'HIDE_LOADING'
    }
}
