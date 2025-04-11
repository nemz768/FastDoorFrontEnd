import '../styles/footer.css'


export const Footer = () => {
    return (
        <footer className="footer">
            <p>Контактная информация: info@doorscompany.com</p>
            <p><a href="/privacy">Политика конфиденциальности</a> | <a href="/terms">Условия использования</a></p>
            <div className="social-links">
                <a href="https://mrdverkin.ru/">Каталог</a>
                <a href="https://twitter.com">Twitter</a>
            </div>
        </footer>
    );
};
