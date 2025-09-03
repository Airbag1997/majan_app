import { SectionProps } from './type';

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

export default Section;

