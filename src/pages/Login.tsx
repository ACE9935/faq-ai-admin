import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import BasicInput from "../tool-components/BasicInput";
import Heading1 from "../components/Heading1";
import GoogleButton from "../form-components/GoogleButton";
import Button from "../tool-components/Button";
import {useAdminAccess} from "../hooks/useAdminAccess";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState<null | string>(null);
  const { user: currentUser, signIn, signInWithGoogle, signOut, loading:userLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminAccess();

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(null);

    // Validation
    if (!user.email || !user.password) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Sign in with Supabase
    const { error } = await signIn(user.email, user.password);

    if (error) {
      setShowError("Veuillez vérifier votre adresse e-mail et votre mot de passe.");
    } else {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue ! Vous êtes maintenant connecté.",
      });
      navigate('/admin');
    }

    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Error with Google login:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion avec Google",
        variant: "destructive",
      });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen justify-center py-6">
      <form onSubmit={handleSubmit} className="bg-white flex flex-col gap-4 p-12 rounded-md shadow-md w-full max-w-[35rem]">
        <div className="mb-6"><Heading1>Connectez-vous</Heading1></div>
        <GoogleButton type="button" onClick={(e:any)=>{e.preventDefault();handleGoogleSignUp()}}>Se connecter avec Google</GoogleButton>
        
        <BasicInput 
          type="email" 
          label="Email" 
          placeholder="Entrez votre email"
          value={user.email}
          onChange={(value: string) => handleInputChange('email', value)}
          required
        />
        
        <BasicInput 
          type="password" 
          label="Mot de passe" 
          placeholder="Entrez votre mot de passe"
          value={user.password}
          onChange={(value: string) => handleInputChange('password', value)}
          required
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        {showError && 
        <Alert severity="error">
            <AlertTitle>Erreur de connexion</AlertTitle>
            {showError}
        </Alert>}
        
      </form>
    </main>
  );
}

export default Login;