// Підключення плагіна з node_modules
import SimpleBar from 'simplebar';
// Підключення стилів з node_modules
import 'simplebar/dist/simplebar.css';

// Додаємо до блоку атрибут data-simplebar

// Також можна ініціалізувати наступним кодом, застосовуючи налаштування

if (document.querySelectorAll('.select__scroll').length) {
    document.querySelectorAll('.select__scroll').forEach(scrollBlock => {
        new SimpleBar(scrollBlock, {
            autoHide: true
        });
    });
}
