import { cn } from '@bem-react/classname';
import { CSSProperties, FC } from 'react';

import { ContactsProps } from '@/entities/contacts/domain';
import { Row } from '@/entities/contacts/ui/row';
import { SocialItem } from '@/entities/contacts/ui/social-item';

import { formatNumber } from '@/shared/lib/string-utils';
import { GeoPointIcon } from '@/shared/ui/GeoPointIcon';
import { MailIcon } from '@/shared/ui/mailIcon';
import { MaxIcon } from '@/shared/ui/max-icon';
import { PhoneIcon } from '@/shared/ui/PhoneIcon';
import { RutubeIcon } from '@/shared/ui/rutube-icon';
import { TelegrammIcon } from '@/shared/ui/telegramm-icon';
import { VkIcon } from '@/shared/ui/vk-icon';

const cnContacts = cn('Contacts');
const DEFAULT_ROW_SIZE = 17;
const DEFAULT_SOCIAL_SIZE = 50;
const DEFAULT_GEO_ICON = { width: 9, height: 16 };
const DEFAULT_MAIL_ICON = { width: 21, height: 17 };
const DEFAULT_PHONE_ICON = { width: 21, height: 24 };
const DEFAULT_TELEGRAM_ICON = { width: 44, height: 45 };
const DEFAULT_MAX_ICON = { width: 36, height: 36 };
const DEFAULT_VK_ICON = { width: 42, height: 42 };
const DEFAULT_RUTUBE_ICON = { width: 36, height: 40 };

const getScaledSize = (base: number, size: number) =>
  Math.round((base * size) / DEFAULT_ROW_SIZE);

const getSocialScaledSize = (base: number, size: number) =>
  Math.round((base * size) / DEFAULT_SOCIAL_SIZE);

export const ContactsLayout: FC<ContactsProps> = ({
  address,
  email,
  phones,
  telegram,
  max,
  vk,
  ruTube,
  color,
  size = DEFAULT_ROW_SIZE
}) => {
  const iconColor = color ?? '#040404';
  const socialSize = getScaledSize(DEFAULT_SOCIAL_SIZE, size);
  const socialListStyle = {
    gap: `${Math.round((20 * size) / DEFAULT_ROW_SIZE)}px`
  } satisfies CSSProperties;

  return (
    <>
      <Row color={color} size={size}>
        <GeoPointIcon
          fill={iconColor}
          width={getScaledSize(DEFAULT_GEO_ICON.width, size)}
          height={getScaledSize(DEFAULT_GEO_ICON.height, size)}
        />
        <span>{address}</span>
      </Row>
      <Row color={color} size={size}>
        <MailIcon
          color={iconColor}
          width={getScaledSize(DEFAULT_MAIL_ICON.width, size)}
          height={getScaledSize(DEFAULT_MAIL_ICON.height, size)}
        />
        <a href={`mailto:${email}`}>{email}</a>
      </Row>
      {phones.map((phone, idx) => (
        <a href={`tel:${phone}`} key={idx}>
          <Row color={color} size={size}>
            <PhoneIcon
              color={iconColor}
              width={getScaledSize(DEFAULT_PHONE_ICON.width, size)}
              height={getScaledSize(DEFAULT_PHONE_ICON.height, size)}
            />
            {formatNumber(phone)}
          </Row>
        </a>
      ))}
      <ul
        className={cnContacts('SocialList', [
          'flex',
          'items-center',
          'justify-center',
          'w-full',
          'mt-8.5'
        ])}
        style={socialListStyle}
      >
        <li>
          <SocialItem
            color={color}
            size={socialSize}
            href={telegram}
            icon={
              <TelegrammIcon
                width={getSocialScaledSize(DEFAULT_TELEGRAM_ICON.width, socialSize)}
                height={getSocialScaledSize(DEFAULT_TELEGRAM_ICON.height, socialSize)}
              />
            }
          />
        </li>
        <li>
          <SocialItem
            color={color}
            size={socialSize}
            href={max}
            icon={
              <MaxIcon
                width={getSocialScaledSize(DEFAULT_MAX_ICON.width, socialSize)}
                height={getSocialScaledSize(DEFAULT_MAX_ICON.height, socialSize)}
              />
            }
          />
        </li>
        {/*
          WhatsApp temporarily disabled.
          Keep the prop for possible rollback, but do not render it in UI.
          {!!props.whatsapp && (
            <li>
              <SocialItem
                color={color}
                size={socialSize}
                href={props.whatsapp}
                icon={<WhatsAppIcon />}
              />
            </li>
          )}
        */}
        <li>
          <SocialItem
            color={color}
            size={socialSize}
            href={vk}
            icon={
              <VkIcon
                width={getSocialScaledSize(DEFAULT_VK_ICON.width, socialSize)}
                height={getSocialScaledSize(DEFAULT_VK_ICON.height, socialSize)}
              />
            }
          />
        </li>
        {!!ruTube && (
          <li>
            <SocialItem
              color={color}
              size={socialSize}
              href={ruTube}
              icon={
                <RutubeIcon
                  width={getSocialScaledSize(DEFAULT_RUTUBE_ICON.width, socialSize)}
                  height={getSocialScaledSize(DEFAULT_RUTUBE_ICON.height, socialSize)}
                />
              }
            />
          </li>
        )}
      </ul>
    </>
  );
};
