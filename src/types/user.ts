// src/types/user.ts

/** representação mínima de um usuário para UI */
export interface UserLite {
    /** id interno (não precisa usar no modal) */
    id: string;
    /** nome exibido */
    name: string | null;
    /** username (login) */
    userName: string | null;
    /** url da imagem de perfil */
    image?: string | null;
  }
  
  /** quem te segue */
  export interface Follower {
    follower: UserLite;
  }
  
  /** quem você segue */
  export interface Following {
    following: UserLite;
  }
  
  /** objeto completo que vem do servidor */
  export interface UserData {
    _count: {
      followers: number;
      following: number;
    };
    followers: Follower[];
    following: Following[];
  }
  