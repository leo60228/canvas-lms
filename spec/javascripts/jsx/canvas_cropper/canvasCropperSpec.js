/*
 * Copyright (C) 2016 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import {shallow, mount} from 'enzyme'
import Cropper from 'jsx/canvas_cropper/cropper'

let file, wrapper

QUnit.module('CanvasCropper', hooks => {
  hooks.beforeEach(() => {
    const blob = dataURItoBlob(filedata)
    file = new File([blob], 'test.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now()
    })
    wrapper = mount(<Cropper imgFile={file} width={100} height={100} />)
  })

  test('renders the component', () => {
    ok(wrapper.find('.CanvasCropper').exists(), 'cropper is in the DOM')
  })

  test('renders the image', () => {
    ok(wrapper.find('.Cropper-image').exists(), 'cropper image is in the DOM')
  })

  test('getImage returns cropped image object', assert => {
    assert.expect(1)
    const done = assert.async()

    wrapper
      .instance()
      .crop()
      .then(image => {
        ok(image instanceof Blob, 'image object is a blob')
        done()
      })
  })
})

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], {type: mimeString})
  return blob
}

const filedata = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QB0RXhpZgAATU0AKgAAAAgAB
AESAAMAAAABAAEAAAEaAAUAAAABAAAAPgEbAAUAAAABAAAARodpAAQAAAABAAAATgAAAAAAAABIA
AAAAQAAAEgAAAABAAKgAgAEAAAAAQAAAJagAwAEAAAAAQAAAJEAAAAA/+EKCWh0dHA6Ly9ucy5hZ
G9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZ
VN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0a
z0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnL
zE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iI
iB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHBob
3Rvc2hvcDpJbnN0cnVjdGlvbnM9IkZCTUQwMTAwMGE5YzBkMDAwMDM0MmEwMDAwZjk0NTAwMDBmM
zQ4MDAwMDdlNGMwMDAwN2Q1YTAwMDA5ZTgzMDAwMDA3OGIwMDAwYzg4ZjAwMDA0NDk1MDAwMDY1Z
jQwMDAwIiBwaG90b3Nob3A6VHJhbnNtaXNzaW9uUmVmZXJlbmNlPSJTNlZPcjVxOWRLa2Joekpvb
2ZFVCIvPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI
CAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz4A/+0AyFBob3Rvc
2hvcCAzLjAAOEJJTQQEAAAAAACPHAFaAAMbJUccAgAAAgACHAJnABRTNlZPcjVxOWRLa2Joekpvb
2ZFVBwCKABiRkJNRDAxMDAwYTljMGQwMDAwMzQyYTAwMDBmOTQ1MDAwMGYzNDgwMDAwN2U0YzAwM
DA3ZDVhMDAwMDllODMwMDAwMDc4YjAwMDBjODhmMDAwMDQ0OTUwMDAwNjVmNDAwMDAAOEJJTQQlA
AAAAAAQo3VAxGRC7t34ynl5OG+7Cv/iC/hJQ0NfUFJPRklMRQABAQAAC+gAAAAAAgAAAG1udHJSR
0IgWFlaIAfZAAMAGwAVACQAH2Fjc3AAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAD21gABA
AAAANMtAAAAACn4Pd6v8lWueEL65MqDOQ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE
GRlc2MAAAFEAAAAeWJYWVoAAAHAAAAAFGJUUkMAAAHUAAAIDGRtZGQAAAngAAAAiGdYWVoAAApoA
AAAFGdUUkMAAAHUAAAIDGx1bWkAAAp8AAAAFG1lYXMAAAqQAAAAJGJrcHQAAAq0AAAAFHJYWVoAA
ArIAAAAFHJUUkMAAAHUAAAIDHRlY2gAAArcAAAADHZ1ZWQAAAroAAAAh3d0cHQAAAtwAAAAFGNwc
nQAAAuEAAAAN2NoYWQAAAu8AAAALGRlc2MAAAAAAAAAH3NSR0IgSUVDNjE5NjYtMi0xIGJsYWNrI
HNjYWxlZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAAJKAAAA+EAAC2z2N1cnYAA
AAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANwA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3A
HwAgQCGAIsAkACVAJoAnwCkAKkArgCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBD
QETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRA
dkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4
ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtB
DsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcFdwWGBZYFpgW1BcUF1
QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBysHPQdPB2EHdAeGB5kHrAe/B
9IH5Qf4CAsIHwgyCEYIWghuCIIIlgiqCL4I0gjnCPsJEAklCToJTwlkCXkJjwmkCboJzwnlCfsKE
QonCj0KVApqCoEKmAquCsUK3ArzCwsLIgs5C1ELaQuAC5gLsAvIC+EL+QwSDCoMQwxcDHUMjgynD
MAM2QzzDQ0NJg1ADVoNdA2ODakNww3eDfgOEw4uDkkOZA5/DpsOtg7SDu4PCQ8lD0EPXg96D5YPs
w/PD+wQCRAmEEMQYRB+EJsQuRDXEPURExExEU8RbRGMEaoRyRHoEgcSJhJFEmQShBKjEsMS4xMDE
yMTQxNjE4MTpBPFE+UUBhQnFEkUahSLFK0UzhTwFRIVNBVWFXgVmxW9FeAWAxYmFkkWbBaPFrIW1
hb6Fx0XQRdlF4kXrhfSF/cYGxhAGGUYihivGNUY+hkgGUUZaxmRGbcZ3RoEGioaURp3Gp4axRrsG
xQbOxtjG4obshvaHAIcKhxSHHscoxzMHPUdHh1HHXAdmR3DHeweFh5AHmoelB6+HukfEx8+H2kfl
B+/H+ogFSBBIGwgmCDEIPAhHCFIIXUhoSHOIfsiJyJVIoIiryLdIwojOCNmI5QjwiPwJB8kTSR8J
Ksk2iUJJTglaCWXJccl9yYnJlcmhya3JugnGCdJJ3onqyfcKA0oPyhxKKIo1CkGKTgpaymdKdAqA
io1KmgqmyrPKwIrNitpK50r0SwFLDksbiyiLNctDC1BLXYtqy3hLhYuTC6CLrcu7i8kL1ovkS/HL
/4wNTBsMKQw2zESMUoxgjG6MfIyKjJjMpsy1DMNM0YzfzO4M/E0KzRlNJ402DUTNU01hzXCNf02N
zZyNq426TckN2A3nDfXOBQ4UDiMOMg5BTlCOX85vDn5OjY6dDqyOu87LTtrO6o76DwnPGU8pDzjP
SI9YT2hPeA+ID5gPqA+4D8hP2E/oj/iQCNAZECmQOdBKUFqQaxB7kIwQnJCtUL3QzpDfUPARANER
0SKRM5FEkVVRZpF3kYiRmdGq0bwRzVHe0fASAVIS0iRSNdJHUljSalJ8Eo3Sn1KxEsMS1NLmkviT
CpMcky6TQJNSk2TTdxOJU5uTrdPAE9JT5NP3VAnUHFQu1EGUVBRm1HmUjFSfFLHUxNTX1OqU/ZUQ
lSPVNtVKFV1VcJWD1ZcVqlW91dEV5JX4FgvWH1Yy1kaWWlZuFoHWlZaplr1W0VblVvlXDVchlzWX
SddeF3JXhpebF69Xw9fYV+zYAVgV2CqYPxhT2GiYfViSWKcYvBjQ2OXY+tkQGSUZOllPWWSZedmP
WaSZuhnPWeTZ+loP2iWaOxpQ2maafFqSGqfavdrT2una/9sV2yvbQhtYG25bhJua27Ebx5veG/Rc
CtwhnDgcTpxlXHwcktypnMBc11zuHQUdHB0zHUodYV14XY+dpt2+HdWd7N4EXhueMx5KnmJeed6R
nqlewR7Y3vCfCF8gXzhfUF9oX4BfmJ+wn8jf4R/5YBHgKiBCoFrgc2CMIKSgvSDV4O6hB2EgITjh
UeFq4YOhnKG14c7h5+IBIhpiM6JM4mZif6KZIrKizCLlov8jGOMyo0xjZiN/45mjs6PNo+ekAaQb
pDWkT+RqJIRknqS45NNk7aUIJSKlPSVX5XJljSWn5cKl3WX4JhMmLiZJJmQmfyaaJrVm0Kbr5wcn
Imc951kndKeQJ6unx2fi5/6oGmg2KFHobaiJqKWowajdqPmpFakx6U4pammGqaLpv2nbqfgqFKox
Kk3qamqHKqPqwKrdavprFys0K1ErbiuLa6hrxavi7AAsHWw6rFgsdayS7LCszizrrQltJy1E7WKt
gG2ebbwt2i34LhZuNG5SrnCuju6tbsuu6e8IbybvRW9j74KvoS+/796v/XAcMDswWfB48JfwtvDW
MPUxFHEzsVLxcjGRsbDx0HHv8g9yLzJOsm5yjjKt8s2y7bMNcy1zTXNtc42zrbPN8+40DnQutE80
b7SP9LB00TTxtRJ1MvVTtXR1lXW2Ndc1+DYZNjo2WzZ8dp22vvbgNwF3IrdEN2W3hzeot8p36/gN
uC94UThzOJT4tvjY+Pr5HPk/OWE5g3mlucf56noMui86Ubp0Opb6uXrcOv77IbtEe2c7ijutO9A7
8zwWPDl8XLx//KM8xnzp/Q09ML1UPXe9m32+/eK+Bn4qPk4+cf6V/rn+3f8B/yY/Sn9uv5L/tz/b
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`
