export function Loading() {
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
    loading.classList.remove('GlobalLoading_hidden')
    if (document.documentElement.classList.contains('lock')) {
        document.documentElement.classList.add('lock_lock')
    } else {
        document.documentElement.classList.add('lock')
    }
}

export function hide() {
    let loading = document.querySelector('.GlobalLoading')
    loading.classList.add('GlobalLoading_hidden')
    if (document.documentElement.classList.contains('lock_lock')) {
        document.documentElement.classList.remove('lock_lock')
    } else {
        document.documentElement.classList.remove('lock')
    }
}