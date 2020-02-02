import React, { Component } from 'react'
import logoMG from '../imgs/byMG.svg'

export class Footer extends Component {
  render() {
    return (
      <div>
        <footer>
            <a href="www.monsieurguiz.fr" className="footer__byMG_link">
              <img src={logoMG} alt="by Monsieur Guiz" />
            </a>
        </footer>
      </div>
    )
  }
}

export default Footer
