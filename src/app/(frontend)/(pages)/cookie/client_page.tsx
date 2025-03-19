'use client'

import { Gutter } from '@components/Gutter/index'
import { Cell, Grid } from '@faceless-ui/css-grid'
import RadioGroup from '@forms/fields/RadioGroup/index'
import FormComponent from '@forms/Form/index'
import { usePrivacy } from '@root/providers/Privacy/index'
import React from 'react'

import classes from './index.module.scss'

export const CookieClientPage: React.FC = () => {
  const [trackingCookies, setTrackingCookies] = React.useState<null | string>(null)
  const { cookieConsent, updateCookieConsent } = usePrivacy()

  React.useEffect(() => {
    if (typeof cookieConsent !== 'undefined') {
      setTrackingCookies(cookieConsent ? 'true' : 'false')
    }
    if (cookieConsent) {
      setTrackingCookies('true')
    }
  }, [cookieConsent])

  const handleCookieConsentChange = (newValue: string) => {
    const newConsent = newValue === 'true'
    updateCookieConsent(newConsent)
    setTrackingCookies(newValue)
  }

  return (
    <React.Fragment>
      <Gutter className={classes.cookieWrap}>
        <div className="grid">
          <div className="cols-12 cols-m-8">
            <h2>Cookie Policy</h2>
            <p>Effective as of March 28, 2024.</p>
            <p>
              This cookie policy explains how Payload CMS, Inc. and our subsidiaries and affiliates
              ("<b>Payload</b>," "<b>we</b>", “<b>us</b>” or "<b>our</b>") use cookies to help
              improve your experience of our website at{' '}
              <a href="https://payloadcms.com/">https://payloadcms.com</a> and any other website
              that we own or control and which posts or links to this cookie policy (collectively,
              the “Sites”). This cookie policy complements Payload’s privacy policy. It covers the
              use of cookies between your device and our Sites.
            </p>
            <p>
              We also provide basic information on third-party services we may use, who may also use
              cookies as part of their service. If you don’t wish to accept cookies from us or from
              third-parties on which we rely, please let us know by rejecting all or some categories
              of cookies via the cookie banner that is displayed to you when you visit our Sites. In
              such a case, we may be unable to provide you with some of your desired content and
              services.
            </p>
            <h3>What is a cookie?</h3>
            <p>
              A cookie is a small piece of data that a website stores on your device when you visit.
              It typically contains information about the website itself, a unique identifier that
              allows the website to recognize your web browser when you return, additional data that
              serves the cookie’s purpose, and the lifespan of the cookie itself.
            </p>
            <p>
              Cookies are used to enable certain features (e.g. logging in), track site usage (e.g.
              analytics), store your user settings (e.g. time zone, notification preferences), and
              to personalize your content (e.g. advertising, language).
            </p>
            <p>
              Cookies set by other sites and companies (i.e. third parties) are called third-party
              cookies. They can be used to track you on other websites that use the same third-party
              service. We use third party cookies on our Sites.
            </p>
            <h3>Types of cookies and how we use them</h3>
            <h4>Strictly necessary cookies</h4>
            <p>
              Strictly necessary cookies are crucial to your experience of a website, enabling core
              features like user logins, account management, shopping carts, and payment processing.
              These cookies are necessary for the Sites to function and cannot be switched off in
              our systems.
            </p>
            <p>We use strictly necessary cookies to enable certain functions on our Sites.</p>
            <h4>Performance cookies</h4>
            <p>
              Performance cookies track how you use a website during your visit. Typically, this
              information is aggregated, with information tracked across all Sites users. They help
              companies understand visitor usage patterns, identify and diagnose problems or errors
              their users may encounter, and make better strategic decisions in improving their
              audience’s overall website experience. These cookies may be set by the website you’re
              visiting (first-party cookie) or by third-party services.
            </p>
            <p>We use performance cookies on our Sites.</p>
            <h4>Functional cookies</h4>
            <p>
              Functional cookies are used to collect information about your device and any settings
              you may configure on the website you’re visiting (like language and time zone
              settings). With this information, websites can provide you with customized, enhanced,
              or optimized content and services. These cookies may be set by the website you’re
              visiting (first-party) or by third-party services.
            </p>
            <p>We use functional cookies for selected features on our Sites.</p>
            <h4>Targeting/advertising cookies</h4>
            <p>
              Targeting/advertising cookies help determine what promotional content is most relevant
              and appropriate to you and your interests. Websites may use them to deliver targeted
              advertising or limit the number of times you see an advertisement. This helps
              companies improve the effectiveness of their campaigns and the quality of content
              presented to you. These cookies may be set by the website you’re visiting
              (first-party) or by third-party services. Targeting/advertising cookies set by
              third-parties may be used to track you on other websites that use the same third-party
              service.
            </p>
            <p>We use targeting/advertising cookies on our Sites.</p>
            <h4>What types of cookies and similar tracking technologies do we use on the Sites?</h4>
            <p>
              On the Sites, we use cookies and other tracking technologies described in the table
              below.
            </p>
            <div className={classes.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Name of the cookie</th>
                    <th>Category and purpose</th>
                    <th>Duration of the cookie</th>
                    <th>Who serves the cookie</th>
                    <th>How to control the cookie</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>_hstc</td>
                    <td>Targeting/advertising: to store time of visit.</td>
                    <td>1 year after the user’s visit</td>
                    <td>HubSpot</td>
                    <td>
                      You can read more about how HubSpot manages data{' '}
                      <a href="https://knowledge.hubspot.com/privacy-and-consent/what-cookies-does-hubspot-set-in-a-visitor-s-browser">
                        here
                      </a>
                      . See your choices' section below.
                    </td>
                  </tr>
                  <tr>
                    <td>_hssc</td>
                    <td>Functional: to store aggregated statistics.</td>
                    <td>Session cookie (expires when the user closes the browser)</td>
                    <td>HubSpot</td>
                    <td>
                      You can read more about how HubSpot manages data{' '}
                      <a href="https://knowledge.hubspot.com/privacy-and-consent/what-cookies-does-hubspot-set-in-a-visitor-s-browser">
                        here
                      </a>
                      . See your choices' section below.
                    </td>
                  </tr>
                  <tr>
                    <td>_hssrc</td>
                    <td>Performance: to store a unique session ID.</td>
                    <td>Session cookie (expires when the user closes the browser)</td>
                    <td>HubSpot</td>
                    <td>
                      You can read more about how HubSpot manages data{' '}
                      <a href="https://knowledge.hubspot.com/privacy-and-consent/what-cookies-does-hubspot-set-in-a-visitor-s-browser">
                        here
                      </a>
                      . See your choices' section below.
                    </td>
                  </tr>
                  <tr>
                    <td>hubspotutk</td>
                    <td>Targeting/advertising: to store and track a visitor's identity.</td>
                    <td>1 year and a half after the user’s visit</td>
                    <td>HubSpot</td>
                    <td>
                      You can read more about how HubSpot manages data{' '}
                      <a href="https://knowledge.hubspot.com/privacy-and-consent/what-cookies-does-hubspot-set-in-a-visitor-s-browser">
                        here
                      </a>
                      . See your choices' section below.
                    </td>
                  </tr>
                  <tr>
                    <td>_ga</td>
                    <td>Performance: to store and count pageviews.</td>
                    <td>2 years after the user’s visit</td>
                    <td>Google</td>
                    <td>
                      You can find out more information about Google Analytics cookies{' '}
                      <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                        here
                      </a>{' '}
                      and about how Google protects your data{' '}
                      <a href="https://marketingplatform.google.com/about/">here</a>. You can
                      prevent the use of Google Analytics relating to your use of our Sites by
                      downloading and installing a browser plugin available{' '}
                      <a href="https://tools.google.com/dlpage/gaoptout?hl=en-GB">here</a>. See your
                      choices’ section below.
                    </td>
                  </tr>
                  <tr>
                    <td>_gcl_au</td>
                    <td>Targeting/advertising: to store and track conversions.</td>
                    <td>1 year after the user’s visit</td>
                    <td>Google</td>
                    <td>
                      You can find out more information about Google Analytics cookies{' '}
                      <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                        here
                      </a>{' '}
                      and about how Google protects your data{' '}
                      <a href="https://marketingplatform.google.com/about/">here</a>. You can
                      prevent the use of Google Analytics relating to your use of our Sites by
                      downloading and installing a browser plugin available{' '}
                      <a href="https://tools.google.com/dlpage/gaoptout?hl=en-GB">here</a>. See your
                      choices’ section below.
                    </td>
                  </tr>
                  <tr>
                    <td>_gat_FLQ5THRMZQ</td>
                    <td>Performance: to read and filter requests from bots</td>
                    <td>Session cookie (expires when the user closes the browser)</td>
                    <td>Google</td>
                    <td>
                      You can find out more information about Google Analytics cookies{' '}
                      <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                        here
                      </a>{' '}
                      and about how Google protects your data{' '}
                      <a href="https://marketingplatform.google.com/about/">here</a>. You can
                      prevent the use of Google Analytics relating to your use of our Sites by
                      downloading and installing a browser plugin available{' '}
                      <a href="https://tools.google.com/dlpage/gaoptout?hl=en-GB">here</a>. See your
                      choices’ section below.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h4>Other technologies</h4>
            <p>
              In addition to cookies, our Sites may use other technologies, such as Flash technology
              to pixel tags to collect information automatically.
            </p>
            <h5>Browser Web Storage.</h5>
            <p>
              We may use browser web storage (including via HTML5), also known as locally stored
              objects (“LSOs”), for similar purposes as cookies. Browser web storage enables the
              storage of a larger amount of data than cookies. Your web browser may provide
              functionality to clear your browser web storage.
            </p>
            <h5>Flash Technology.</h5>
            <p>
              We may use Flash cookies (which are also known as Flash Local Shared Object (“Flash
              LSOs”)) on our Sites to collect and store information about your use of our Sites.
              Unlike other cookies, Flash cookies cannot be removed or rejected via your browser
              settings. If you do not want Flash LSOs stored on your computer or mobile device, you
              can adjust the settings of your Flash player to block Flash LSO storage using the
              tools contained in the Website Storage Settings Panel. You can also control Flash LSOs
              by going to the Global Storage Settings Panel and following the instructions. Please
              note that setting the Flash Player to restrict or limit acceptance of Flash LSOs may
              reduce or impede the functionality of some Flash applications, including, potentially,
              Flash applications used in connection with our Sites.
            </p>
            <h5>Web Beacons.</h5>
            <p>
              We may also use web beacons (which are also known as pixel tags and clear GIFs) on our
              Sites and in our HTML formatted emails to track the actions of users on our Sites and
              interactions with our emails. Unlike cookies, which are stored on the hard drive of
              your computer or mobile device by a website, pixel tags are embedded invisibly on
              webpages or within HTML formatted emails. Pixel tags are used to demonstrate that a
              webpage was accessed or that certain content was viewed, typically to measure the
              success of our marketing campaigns or engagement with our emails and to compile
              statistics about usage of the Sites, so that we can manage our content more
              effectively.
            </p>
            <h4>Your choices</h4>
            <p>
              You can decide not to accept cookies or other technologies. If you do not accept our
              cookies or other technologies, you may experience some inconvenience in your use of
              our Sites. For example, we may not be able to recognize your computer or mobile device
              and you may need to log in every time you visit our Sites.
            </p>
            <h5>Cookie Preference Centre.</h5>
            <p>
              You can change the cookie settings when you visit our Sites via our cookie banner that
              is displayed to you when you first visit our Sites, or at any time by visiting the
              cookie preferences below. Our cookie banner and cookie preference center allow you to
              accept, refuse or manage the setting of all or some cookies:
            </p>
            <ul>
              <li>Strictly necessary cookies do not require your consent.</li>
              <li>
                When we deploy other cookies, you have the possibility to either accept or reject
                all cookies, or to allow the deployment of the categories of cookies you prefer, by
                clicking on the appropriate button (i.e. “accept all”, “reject all” or “manage my
                settings”).
              </li>
            </ul>
            <h5>Blocking cookies in your browser.</h5>
            <p>
              Most browsers let you remove or reject cookies. To do this, follow the instructions in
              your browser settings. Many browsers accept cookies by default until you change your
              settings. In order to understand these settings, the following links may be helpful.
              Otherwise, you should use the 'Help' option in your internet browser for more details:
            </p>
            <ul>
              <li>
                <a href="https://support.microsoft.com/en-us/search?query=enable%20cookies%20in%20edge">
                  Cookie settings in Microsoft Edge
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer?redirectlocale=en-US&redirectslug=Cookies">
                  Cookie settings in Firefox
                </a>
              </li>
              <li>
                <a href="https://support.google.com/chrome/bin/answer.py?hl=en&answer=95647">
                  Cookie settings in Chrome
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/en-us/HT201265">Cookie settings in Safari</a>
              </li>
            </ul>
            <h5>Blocking images/clear gifs.</h5>
            <p>
              Most browsers and devices allow you to configure your device to prevent images from
              loading. To do this, follow the instructions in your particular browser or device
              settings.
            </p>
            <h5>Third-party opt-out option.</h5>
            <p>
              You can opt-out of interest-based advertising through some of the third parties listed
              in the chart above by using the corresponding third-party opt-out tool provided in the
              chart.
            </p>
            <h5>Industry association opt-outs.</h5>
            <p>
              You may opt out of receiving interest-based advertising on websites through members of
              the Network Advertising Initiative by clicking{' '}
              <a href="https://optout.networkadvertising.org/?c=1">here</a> or the Digital
              Advertising Alliance by clicking{' '}
              <a href="https://optout.aboutads.info/?c=2&lang=EN">here</a>. Please note that we also
              may work with companies that offer their own opt-out mechanisms and may not
              participate in the opt-out mechanisms linked above.
            </p>
            <p>
              If you do not accept our cookies, you may experience some inconvenience in your use of
              our Sites. For example, we may not be able to recognize your computer or mobile device
              and you may need to log in every time you visit our Sites.
            </p>
            <p>
              If you choose to opt-out of targeted advertisements, you will still see advertisements
              online, but they may not be relevant to you. Even if you do choose to opt out, not all
              companies that serve online behavioral advertising are included in this list, and so
              you may still receive some cookies and tailored advertisements from companies that are
              not listed.
            </p>
            <p>
              For more information about how we collect, use and share your information, see our
              <a href="/privacy">Privacy Policy</a>.
            </p>
            <h4>Changes</h4>
            <p>
              Information about the cookies we use may be updated from time to time, so please check
              back on a regular basis for any changes.
            </p>
            <h4>Questions</h4>
            <p>
              If you have any questions about this cookie policy, please contact us by email at
              <a href="mailto:info@payloadcms.com">info@payloadcms.com</a>.
            </p>
          </div>
          <div className="cols-16 cols-m-8">
            <h5>Cookie Preferences</h5>
            <p>
              The use of cookies is essential to provide you with the full functionality of our
              website. Your decision to either accept or decline the use of cookies may impact your
              overall experience with our site and the services we can offer. By clicking the
              ENABLED button, you provide your consent to our use of all categories of cookies on
              our site. Similarly, by clicking the DISABLED button, you choose to restrict our use
              of cookies during your visit.
            </p>
            <FormComponent>
              <RadioGroup
                className={classes.radioGroup}
                initialValue={trackingCookies as string}
                onChange={handleCookieConsentChange}
                options={[
                  {
                    label: 'Disabled',
                    value: 'false',
                  },
                  {
                    label: 'Enabled',
                    value: 'true',
                  },
                ]}
              />
            </FormComponent>
          </div>
        </div>
      </Gutter>
    </React.Fragment>
  )
}
