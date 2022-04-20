import React from "react";
import styles from "./style.module.scss";
import { useHistory } from "react-router";
import Toolbar from "../../components/Toolbar";
import Cosmonaut from "../../icons/Cosmonaut.svg";
import CosmonautPanel from "../../icons/Cosmonaut2.svg";
import InOut from "../../icons/InOutIcon.svg";
import Commission from "../../icons/ComissionIcon.svg";
import CardOut from "../../icons/CardOutIcon.svg";
import Times from "../../icons/TimesIcon.svg";
import Plus from "../../icons/PlusIcon.svg";
import ListMark from "../../icons/ListMarkIcon.svg";

type TTabCardProps = {
  name: string;
  change: number;
  value: number;
  selected?: boolean;
};

const TabCard = ({ name, change, value, selected }: TTabCardProps) => {
  const classNameChange: string =
    styles.tab_card__change +
    (change > 0 ? ` ${styles.tab_card__change_plus}` : "");
  const classNameCard =
    styles.tab_card + (selected ? ` ${styles.tab_card_selected}` : "");
  const classNameValue =
    styles.tab_card__value +
    (selected ? ` ${styles.tab_card__value_selected}` : "");
  const classNameName =
    styles.tab_card__name +
    (selected ? ` ${styles.tab_card__name_selected}` : "");

  return (
    <div className={classNameCard}>
      <div className={classNameName}>{name}</div>
      <div className={classNameChange}>{`${change}%`}</div>
      <div className={classNameValue}>{value}</div>
    </div>
  );
};

TabCard.defaultProps = {
  selected: false,
};

const Main = () => {
  const history = useHistory();

  return (
    <>
      <Toolbar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.exchange}>
            <div className={styles.exchange__title}>Биржа криптовалют</div>
            <div className={styles.exchange__adv}>
              Покупайте и продавайте криптовалюту с минимальной комиссией
            </div>
            <button
              type="button"
              className={styles.button}
              onClick={() => history.push("/login")}
            >
              Зарегистрироваться
            </button>
          </div>
          <img src={Cosmonaut} alt="" />
        </div>
        <div className={styles.tab_panel}>
          <TabCard name="USDT/RUB" change={-0.87} value={74.03} />
          <TabCard name="XRP/RUB" change={2.84} value={81.94} />
          <TabCard name="ETH/RUB" change={2.84} value={256234.5} selected />
          <TabCard name="BTC/RUB" change={-0.87} value={3406345} />
          <TabCard name="USDT/RUB" change={-0.87} value={74.03} />
          <TabCard name="XRP/RUB" change={2.84} value={81.94} />
        </div>
        <div className={styles.advantage_container}>
          <div className={styles.advantage_container__item}>
            <img src={InOut} alt="" />
            <div className={styles.advantage_container__text}>
              Пополнение и вывод наличных рублей без комиссии
            </div>
          </div>
          <div className={styles.advantage_container__item}>
            <img src={Commission} alt="" />
            <div className={styles.advantage_container__text}>
              Минимальные комиссии от 0.1% до 0.2% за сделку
            </div>
          </div>
          <div className={styles.advantage_container__item}>
            <img src={CardOut} alt="" />
            <div className={styles.advantage_container__text}>
              Вывод на карты Сбербанк, Тинькофф, Альфа-банк
            </div>
          </div>
          <div className={styles.advantage_container__item}>
            <img src={Times} alt="" />
            <div className={styles.advantage_container__text}>
              Биржа работает круглосуточно в полном объеме
            </div>
          </div>
        </div>
        <div className={styles.target_users}>
          <div className={styles.target_users__title}>
            Для кого предназначена
            <br />
            <span>биржа P2P Exchange</span>
          </div>
          <div className={styles.target_users__container}>
            <div className={styles.target_users__block}>
              <div className={styles.target_users__blockTitle}>
                <img src={Plus} alt="" />
                <div className={styles.target_users__blockTitleText}>
                  ТРЕЙДЕР
                </div>
              </div>
              <div className={styles.target_users__blockAdv}>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Пополнения или вывода баланса наличными
                  </div>
                </div>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Работаем по всей России
                  </div>
                </div>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Вывод рублей на карты/счета Сбербанк, Тинькофф, Альфа-банк
                  </div>
                </div>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Комиссия всего от 0.15% за сделку
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.target_users__block}>
              <div className={styles.target_users__blockTitle}>
                <img src={Plus} alt="" />
                <div className={styles.target_users__blockTitleText}>
                  МАЙНЕР
                </div>
              </div>
              <div className={styles.target_users__blockAdv}>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Продавая свою криптовалюту на бирже вы гарантировано
                    получите наиболее высокий курс и избежите лишних комиссий
                    посредников
                  </div>
                </div>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Комфортная, автоматизированная сделка, не вставая из-за
                    компьютера
                  </div>
                </div>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Получение наличных в кассе, любые регионы, карты, счета,
                    кэшины
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.target_users__block}>
              <div className={styles.target_users__blockTitle}>
                <img src={Plus} alt="" />
                <div className={styles.target_users__blockTitleText}>
                  ОБМЕННИК
                </div>
              </div>
              <div className={styles.target_users__blockAdv}>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Несколько вариантов интеграции Низкая комиссия на отправку
                    криптовалюты
                  </div>
                </div>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Множество обменников уже зарабатывают с биржей Garantex,
                    присоединяйтесь
                  </div>
                </div>
                <div className={styles.target_users__advRow}>
                  <img
                    src={ListMark}
                    alt=""
                    className={styles.target_users__advImg}
                  />
                  <div className={styles.target_users__blockText}>
                    Свяжитесь с нами, чтобы узнать о возможных вариантах
                    интеграции
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panel__column}>
            <div className={styles.panel__title}>
              Отличные возможности для
              <span> арбитража на p2p-площадках</span>
            </div>
            <div className={styles.panel__box}>
              <button
                type="button"
                className={styles.button}
                onClick={() => history.push("/login")}
              >
                Зарегистрироваться
              </button>
              <div className={styles.panel__cosmonaut}>
                <img src={CosmonautPanel} alt="" />
              </div>
            </div>
          </div>
          <div className={styles.blockAdv}>
            <div className={styles.blockAdv__row}>
              <img src={ListMark} alt="" className={styles.blockAdv__img} />
              <div className={styles.blockAdv__text}>
                Стоимость криптовалюты в P2P Exchange часто отличается от
                стоимости на p2p площадках.
              </div>
            </div>
            <div className={styles.blockAdv__row}>
              <img src={ListMark} alt="" className={styles.blockAdv__img} />
              <div className={styles.blockAdv__text}>
                Покупайте дешевле, продавайте в P2P Exchange дороже или
                наоборот, зарабатывайте на этом.
              </div>
            </div>
            <div className={styles.blockAdv__row}>
              <img src={ListMark} alt="" className={styles.blockAdv__img} />
              <div className={styles.blockAdv__text}>
                Вы можете также обратиться в службу поддержки биржи, и мы научим
                вас пользоваться всеми возможностями биржи для зарабатывания
                денег.
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footer__block}>
            <div className={styles.footer__header}>P2P Exchange</div>
            <div
              className={styles.footer__item}
              onClick={() => history.push("/stock")}
            >
              Биржа
            </div>
            <div
              className={styles.footer__item}
              onClick={() => history.push("/otc")}
            >
              P2P
            </div>
            <div
              className={styles.footer__item}
              onClick={() => history.push("/history")}
            >
              История
            </div>
            <div
              className={styles.footer__item}
              onClick={() => history.push("/actives")}
            >
              Активы
            </div>
          </div>
          <div className={styles.footer__block}>
            <div className={styles.footer__header}>Центр знаний</div>
            <div
              className={styles.footer__item}
              onClick={() => history.push("/knowledge-center/articles")}
            >
              Статьи
            </div>
            <div className={styles.footer__item}>Новости</div>
            <div className={styles.footer__item}>Инструкции</div>
            <div className={styles.footer__item}>Вопросы и ответы</div>
          </div>
          <div className={styles.footer__block}>
            <div className={styles.footer__header}>Документы</div>
            <div className={styles.footer__item}>Правила и комиссия</div>
            <div className={styles.footer__item}>
              Политика конфиденциальности
            </div>
            <div className={styles.footer__item}>Инструкции</div>
          </div>
          <div
            className={`${styles.footer__block} ${styles.footer__block_support}`}
          >
            <div className={styles.footer__supportItem}>
              <div className={styles.footer__supportHeader}>
                Поддержка пользователей:
              </div>
              <div className={styles.footer__supportLink}>
                support@p2p-exch.ru
              </div>
            </div>
            <div className={styles.footer__supportItem}>
              <div className={styles.footer__supportHeader}>Телеграм-бот:</div>
              <div className={styles.footer__supportLink}>@p2p-exch.ru</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
