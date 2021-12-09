import Footer from '../Footer';
import Header from '../Header';
import './About.scss';

const About = () => {
    return (
        <>
            <Header />
            <div className='about-page'>
                <p>
                    Wallet is an application which aims to support you to save
                    more money by analyzing your income and expenses.
                </p>
                <p>
                  Add multiple wallets.
                </p>
                <p>
                  Add different categories.
                </p>
                <p>
                   Option to add event related to the transaction. 
                </p>
            </div>
            <Footer />
        </>
    );
};

export default About;
