import LoginTrigger from "./Login";
import SignupTrigger from "./Signup";










export default function Entrypoint({className} : {className: string}){


  return (
  <div className={className}>
    <div className="dead-center">
      <LoginTrigger />
      <SignupTrigger />
    </div>
  </div>
  );
}