export function Loading(): JSX.Element {
    return (
        <div className='GlobalLoading GlobalLoading_hidden'>
            <div className='GlobalLoading__inner'>
                <img src="/Common/loading.svg" alt="loading" />
            </div>
        </div>
    );
}



export function show() {
    let loading = document.querySelector('.GlobalLoading')
    if (loading) {
        loading.classList.remove('GlobalLoading_hidden')
        if (document.documentElement.classList.contains('lock')) {
            document.documentElement.classList.add('lock_lock')
        } else {
            document.documentElement.classList.add('lock')
        }
    } else {
        alert(`'.GlobalLoading' не знайдено`)
    }
}

export function hide() {
    let loading = document.querySelector('.GlobalLoading')
    if (loading) {
        loading.classList.add('GlobalLoading_hidden')
        if (document.documentElement.classList.contains('lock_lock')) {
            document.documentElement.classList.remove('lock_lock')
        } else {
            document.documentElement.classList.remove('lock')
        }
    } else {
        alert(`'.GlobalLoading' не знайдено`)
    }
}