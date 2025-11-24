import React from 'react';
import { CreditCard as CreditCardIcon, Wifi } from 'lucide-react';

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvc: string;
  isFlipped: boolean;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardHolderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvcChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvcFocus: () => void;
  onCvcBlur: () => void;
  onOtherFocus: () => void;
}

export function CreditCard({ 
  cardNumber, 
  cardHolder, 
  expiryDate, 
  cvc, 
  isFlipped,
  onCardNumberChange,
  onCardHolderChange,
  onExpiryChange,
  onCvcChange,
  onCvcFocus,
  onCvcBlur,
  onOtherFocus
}: CreditCardProps) {
  return (
    <div className="perspective">
      <div 
        className="card-container"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          aspectRatio: '1.586',
        }}
      >
        {/* Frente de la tarjeta */}
        <div 
          className="card-face card-front"
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #004030 0%, #006b4f 50%, #008866 100%)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div className="flex justify-between items-start">
            <Wifi className="text-white opacity-80" size={40} />
            <CreditCardIcon className="text-white opacity-80" size={40} />
          </div>

          <div>
            <div className="mb-6">
              <input
                type="text"
                value={cardNumber}
                onChange={onCardNumberChange}
                onFocus={onOtherFocus}
                placeholder="#### #### #### ####"
                className="w-full bg-transparent border-none outline-none text-white tracking-wider placeholder-white placeholder-opacity-40"
                style={{ 
                  fontSize: '24px', 
                  letterSpacing: '3px',
                  caretColor: 'white'
                }}
                maxLength={19}
              />
            </div>

            <div className="flex justify-between items-end">
              <div className="flex-1 mr-4">
                <div className="text-white text-xs opacity-70 mb-1">TITULAR</div>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={onCardHolderChange}
                  onFocus={onOtherFocus}
                  placeholder="NOMBRE APELLIDO"
                  className="w-full bg-transparent border-none outline-none text-white tracking-wide placeholder-white placeholder-opacity-40 uppercase"
                  style={{ caretColor: 'white' }}
                />
              </div>

              <div style={{ width: '80px' }}>
                <div className="text-white text-xs opacity-70 mb-1">VENCE</div>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={onExpiryChange}
                  onFocus={onOtherFocus}
                  placeholder="MM/AA"
                  className="w-full bg-transparent border-none outline-none text-white tracking-wide placeholder-white placeholder-opacity-40"
                  style={{ caretColor: 'white' }}
                  maxLength={5}
                />
              </div>
            </div>
          </div>

          {/* Decoración */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Parte trasera de la tarjeta */}
        <div 
          className="card-face card-back"
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #004030 0%, #006b4f 50%, #008866 100%)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            transform: 'rotateY(180deg)',
          }}
        >
          <div 
            style={{
              backgroundColor: '#000',
              height: '60px',
              marginTop: '40px',
            }}
          />
          
          <div 
            style={{
              margin: '24px 32px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              height: '50px',
              borderRadius: '8px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <div className="text-xs text-gray-600 mr-3">CVC</div>
            <input
              type="text"
              value={cvc}
              onChange={onCvcChange}
              onFocus={onCvcFocus}
              onBlur={onCvcBlur}
              placeholder="***"
              className="bg-white px-4 py-2 rounded border-none outline-none text-center placeholder-gray-400"
              style={{ 
                color: '#004030',
                width: '70px',
                caretColor: '#004030'
              }}
              maxLength={3}
            />
          </div>

          <div className="text-white text-xs px-8 opacity-70 mt-8 text-center">
            Esta tarjeta es propiedad del titular. El uso no autorizado constituye fraude.
          </div>
        </div>
      </div>
    </div>
  );
}